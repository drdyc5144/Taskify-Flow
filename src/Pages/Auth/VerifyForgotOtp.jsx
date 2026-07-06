import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Styles/VerifyForgotOtp.css";
import axios from "axios";

const VerifyForgotOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const baseURL = import.meta.env.VITE_TASKIFY_BASE_URL;

  const email =
    location.state?.email || localStorage.getItem("resetEmail") || "";

  useEffect(() => {
    if (email) {
      localStorage.setItem("resetEmail", email);
    }
  }, [email]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
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

      const lastFilledIndex = Math.min(pastedArray.length, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");

    if (verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axios.post(`${baseURL}/users/verify-forgot-otp`, {
        email: email,
        otp: verificationCode,
      });
      toast.success(response?.data?.message);

      setTimeout(() => {
        setIsVerifying(false);
        navigate("/reset-password");
      }, 2000);
      console.log("forgot verify otp response", response);
    } catch (error) {
      console.log("forgot verify otp error", error);
      toast.error(error?.response?.data?.message || "Invalid OTP");
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const response = await axios.post(`${baseURL}/users/resend-forgot-otp`, {
        email: email,
      });
      console.log("resend forgot verify otp response", response);
      toast.success(response?.data?.message || "OTP resent successfully!");
      setIsResending(false);
    } catch (error) {
      console.log("resend forgot verify otp error", error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
      setIsResending(false);
    }
  };

  return (
    <section className="verify_forgot_container">
      <form className="verify_forgot_holder" onSubmit={handleVerifyOtp}>
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="Top_text">
          <h1>Verify OTP</h1>
          <p>We've sent a 6-digit verification code to</p>
          <span className="verify_email">{email}</span>
          <p className="otp_hint">
            Please check your inbox and enter the code below
          </p>
          <p className="otp_expiry">⏰ This code will expire in 10 minutes</p>
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
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`otp_input ${digit ? "filled" : ""}`}
              disabled={isVerifying || isResending}
            />
          ))}
        </div>

        <div className="resend_container">
          <button
            type="button"
            onClick={handleResendOtp}
            className="resend_btn"
            disabled={isVerifying || isResending}
          >
            {isResending ? "Sending..." : "Didn't receive code? Resend OTP"}
          </button>
        </div>

        <div className="btnholder">
          <button
            type="submit"
            className="verify_btn"
            disabled={isVerifying || isResending}
          >
            {isVerifying ? "Verifying..." : "Verify & Continue"}
          </button>

          <p
            className="back_to_login"
            onClick={() => navigate("/forgot-password")}
          >
            ← Back to Forgot Password
          </p>
        </div>
      </form>
    </section>
  );
};

export default VerifyForgotOtp;
