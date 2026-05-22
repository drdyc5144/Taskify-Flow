import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdPerson } from "react-icons/io";
import "../../Styles/ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

    // Simulate API call - replace with your actual API
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password reset link sent to your email!");
      // Navigate back to login after successful submission
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1500);
  };

  return (
    <section className="forget_container">
      <form className="forget_holder" onSubmit={handleSubmit}>
        {/* Taskify Logo */}
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
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <h3>EMAIL ADDRESS</h3>
        <div className="forget_input">
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
          <button type="submit" className="forget_btn" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="back_to_login" onClick={() => navigate("/login")}>
            Back to Login
          </p>
        </div>
      </form>
    </section>
  );
};

export default ForgetPassword;
