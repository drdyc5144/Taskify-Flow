import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdPerson } from "react-icons/io";
import "../../Styles/ForgotPassword.css";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_TASKIFY_BASE_URL;

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseURL}/users/forgot-password`, {
        email: email,
      });
      localStorage.setItem("resetEmail", email);

      toast.success(response?.data?.message || "OTP sent successfully!");

      setTimeout(() => {
        navigate("/verify-forgot-otp", {
          state: { email: email },
        });
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <section className="forgot_container">
      <form className="forgot_holder" onSubmit={handleSubmit}>
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="Top_text">
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we'll send you an OTP to reset your
            password
          </p>
        </div>

        <h3>EMAIL ADDRESS</h3>
        <div className="forgot_input">
          <IoMdPerson className="input_icon" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="btnholder">
          <button type="submit" className="forgot_btn" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="forgot_back_to_login" onClick={() => navigate("/")}>
            ← Back to Login
          </p>
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;
