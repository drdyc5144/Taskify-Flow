import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../../Styles/ResetPassword.css";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = import.meta.env.TVITE_BASE_URL;

  const email =
    location.state?.email || localStorage.getItem("resetEmail") || "";

  useEffect(() => {
    if (!email && !isSuccess) {
      toast.error("Session expired. Please start over.");
      navigate("/forgot-password");
    }
  }, [email, navigate, isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/users/reset-password`,
        {
          email: email,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("reset password response", response);
      toast.success(response.data.message || "Password reset successfully!");

      localStorage.removeItem("resetEmail");

      // Mark as success to prevent session expired message
      setIsSuccess(true);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to reset password");
      console.log("reset password error", error);
    }
  };

  return (
    <section className="reset_container">
      <form className="reset_holder" onSubmit={handleSubmit}>
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="Top_text">
          <h1>Create New Password</h1>
          <p>Please enter your new password below</p>
        </div>

        <h3>NEW PASSWORD</h3>
        <div className="reset_input">
          <RiLockPasswordFill className="input_icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
          {showPassword ? (
            <FaRegEyeSlash
              className="eye_icon"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaRegEye
              className="eye_icon"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <h3>CONFIRM PASSWORD</h3>
        <div className="reset_input">
          <RiLockPasswordFill className="input_icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          {showConfirmPassword ? (
            <FaRegEyeSlash
              className="eye_icon"
              onClick={() => setShowConfirmPassword(false)}
            />
          ) : (
            <FaRegEye
              className="eye_icon"
              onClick={() => setShowConfirmPassword(true)}
            />
          )}
        </div>

        <div className="password_requirements">
          <p className={newPassword.length >= 8 ? "valid" : "invalid"}>
            ✓ At least 8 characters
          </p>
          <p
            className={
              newPassword && newPassword === confirmPassword
                ? "valid"
                : "invalid"
            }
          >
            ✓ Passwords match
          </p>
        </div>

        <div className="btnholder">
          <button type="submit" className="reset_btn" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="back_to_login" onClick={() => navigate("/")}>
            ← Back to Login
          </p>
        </div>
      </form>
    </section>
  );
};

export default ResetPassword;
