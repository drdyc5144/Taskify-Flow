import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";
import "../../Styles/VerifyUser.css";
import axios from "axios";

const VerifyUser = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(60);
  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);

  //10 mintues timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const inputRefs = useRef([]);
  const nav = useNavigate();

  const baseURL = import.meta.env.TVITE_BASE_URL;
  const savedEmail = JSON.parse(localStorage.getItem("userEmail")) || '""';

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer for resend code
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }

    // Handle right arrow
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedNumbers) {
      const pastedArray = pastedNumbers.split("");
      const newOtp = [...otp];
      for (let i = 0; i < pastedArray.length; i++) {
        newOtp[i] = pastedArray[i];
      }
      setOtp(newOtp);

      // Focus on the next empty input or last input
      const lastFilledIndex = Math.min(pastedArray.length, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      setActiveInput(lastFilledIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${baseURL}/users/verify-otp`,
        {
          email: savedEmail,
          otp: verificationCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      toast.success(response?.data?.message);
      localStorage.removeItem("userEmail");
      console.log("otp response", response);
      setTimeout(() => {
        nav("/");
      }, 3000);
    } catch (error) {
      console.log("otp error", error);
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    console.log("Resending verification code");

    try {
      const response = await axios.post(
        `${baseURL}/users/resend-otp`,
        {
          email: savedEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      toast.success(
        response?.data?.message || "Verification code resent successfully!",
      );
      setOtp(["", "", "", "", "", ""]);
      setCanResend(false);
      setTimeLeft(600);
      // setTimeLeft(60);
    } catch (error) {
      console.log("resent otp", error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="verify_container">
      <form className="verify_holder" onSubmit={handleSubmit}>
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="verify_icon">
          <MdVerified />
        </div>

        <div className="verify_header">
          <h1>Verify Your Email</h1>
          <p>Please enter the 6-digit verification code sent to</p>
          <span className="verify_email">{savedEmail}</span>
        </div>

        <div className="otp_inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`otp_input ${digit ? "filled" : ""} ${
                activeInput === index ? "active" : ""
              }`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="verify_timer">
          {!canResend ? (
            <p>
              Resend code in{" "}
              <span>
                {/* {timeLeft} */}
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>{" "}
              {/* seconds */}
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              className="resend_btn"
              disabled={isLoading}
            >
              <AiOutlineReload />
              Resend Verification Code
            </button>
          )}
        </div>

        <button type="submit" className="verify_btn" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Account"}
        </button>

        <p className="back_to_login" onClick={() => nav("/login")}>
          Back to Login
        </p>
      </form>
    </section>
  );
};

export default VerifyUser;
