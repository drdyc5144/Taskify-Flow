import { IoMdPerson } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import "../../Styles/Signup.css";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa6";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";

const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();
  const baseURL = import.meta.env.TVITE_BASE_URL;
  // console.log(baseURL);

  const handleChange = (e) => {
    // console.log("data sending", userDetails);

    setUserDetails({
      ...userDetails,
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

    if (userDetails.fullName.trim() === "") {
      setError({
        ...error,
        fullName: "Please enter your full name.",
      });

      return;
    }

    if (userDetails.email.trim() === "") {
      setError({
        ...error,
        email: "Please enter your email address.",
      });

      return;
    }

    if (!validateEmail(userDetails.email)) {
      setError({
        ...error,
        email: "Please enter a valid email address.",
      });

      return;
    }

    if (userDetails.password.trim() === "") {
      setError({
        ...error,
        password: "Please enter a password.",
      });

      return;
    }

    if (userDetails.password.length < 8) {
      setError({
        ...error,
        password: "Password must be at least 8 characters.",
      });

      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${baseURL}/users/register`,
        {
          fullName: userDetails?.fullName,
          email: userDetails?.email,
          password: userDetails?.password,
        },
        {
          headers: {
            "Content-Type": "application/Json",
          },
        },
      );
      localStorage.setItem("userInfor", JSON.stringify(userDetails));
      localStorage.setItem("userEmail", JSON.stringify(userDetails.email));
      toast.success(response?.data?.message);
      setIsLoading(false);
      setTimeout(() => {
        nav("/verify-user");
      }, 3000);
      console.log("signup good response", response);
      setUserDetails({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "something went wrong, check your connection",
      );
      setIsLoading(false);
      console.log("sigup error", error);
    }
  };

  return (
    <section className="signup_container">
      <form className="signup_holder" onSubmit={handleSubmit}>
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="Top_text">
          <h1>Create Your Account</h1>
          <p>Join our bank and manage your finances</p>
        </div>

        <h3>FULL NAME</h3>

        <div className="Signup_input">
          <IoMdPerson className="input_icon" />

          <input
            type="text"
            name="fullName"
            placeholder="Enter FullName"
            value={userDetails.fullName}
            onChange={handleChange}
          />
        </div>

        {error.fullName && (
          <p style={{ color: "red", fontSize: "14px" }}>{error.fullName}</p>
        )}

        <h3>EMAIL ADDRESS</h3>

        <div className="Signup_input">
          <IoMdPerson className="input_icon" />

          <input
            type="text"
            name="email"
            placeholder="Enter Email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </div>

        {error.email && (
          <p style={{ color: "red", fontSize: "14px" }}>{error.email}</p>
        )}

        <h3>PASSWORD</h3>

        <div className="Signup_input">
          <RiLockPasswordFill className="input_icon" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={userDetails.password}
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
          <p style={{ color: "red", fontSize: "14px" }}>{error.password}</p>
        )}

        <div className="checkBox">
          <input type="checkbox" />

          <h4>
            I AGREE TO THE{" "}
            <span className="checkbox_span">TERMS AND CONDITION</span>
          </h4>
        </div>

        <div className="btnholder">
          <button
            className="login_btn"
            type="submit"
            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? "Creating Account...." : "Create Account"}
          </button>

          <p>
            Already have an account?
            <span onClick={() => nav("/")}> Login here</span>
          </p>
        </div>
      </form>
    </section>
  );
};

export default SignUp;
