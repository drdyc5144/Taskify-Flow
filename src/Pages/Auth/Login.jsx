import React, { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import "../../Styles/Login.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const nav = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: "",
    });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginUser.email.trim() === "") {
      setError({
        ...error,
        email: "Please enter your email.",
      });
      return;
    } else if (!validateEmail(loginUser.email)) {
      setError({
        ...error,
        email: "Please enter a valid email address.",
      });
      return;
    }

    if (loginUser.password.trim() === "") {
      setError({
        ...error,
        password: "Please enter your password.",
      });
      return;
    }
    if (loginUser.password.length < 6) {
      setError({
        ...error,
        password: "Password must be at least 6 characters long.",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${baseURL}/users/login`,
        {
          email: "",
          password: "",
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      console.log(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <section className="login_container">
      <form className="login_holder" onSubmit={handleSubmit}>
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="Top_text">
          <h2>Login</h2>
          <p>Secure Access to your account</p>
        </div>

        <h3>EMAIL ADDRESS</h3>
        <div className="login_input">
          <IoMdPerson className="input_icon" />
          <input
            type="text"
            className="input"
            name="email"
            placeholder="Enter your email"
            value={loginUser.email}
            onChange={handleChange}
          />
        </div>
        {error.email && (
          <p
            style={{
              color: "red",
              fontSize: "14px",
            }}
          >
            {error.email}
          </p>
        )}

        <h3>PASSWORD</h3>
        <div className="login_input">
          <RiLockPasswordFill className="input_icon" />
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            name="password"
            placeholder="Enter your password"
            value={loginUser.password}
            onChange={handleChange}
          />
          {showPassword ? (
            <FaRegEye
              className="eye_icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FaRegEyeSlash
              className="eye_icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>

        {error.password && (
          <p
            style={{
              color: "red",
              fontSize: "14px",
            }}
          >
            {error.password}
          </p>
        )}

        <div className="rememberMe">
          <div className="checkbox">
            <input type="checkbox" />
            <p>Remember me</p>
          </div>
          <div className="forget">
            <p onClick={() => nav("/forgetPassword")}>Forget Password?</p>
          </div>
        </div>

        <div className="btnholder">
          <button
            type="submit"
            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p>
            Don't have an account?
            <span onClick={() => nav("/")}> Sign Up here</span>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;
