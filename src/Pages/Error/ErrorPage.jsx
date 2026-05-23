import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBackOutline, IoHomeOutline } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import "./Error.css";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const errorCode = location.state?.errorCode || 404;
  const errorMessage = location.state?.errorMessage || "Page Not Found";
  const errorDescription =
    location.state?.errorDescription ||
    "The page you are looking for doesn't exist or has been moved.";

  const getErrorDetails = () => {
    switch (errorCode) {
      case 400:
        return {
          title: "Bad Request",
          description:
            "The server could not understand your request. Please check your input and try again.",
        };
      case 401:
        return {
          title: "Unauthorized",
          description:
            "You need to be logged in to access this page. Please login and try again.",
        };
      case 403:
        return {
          title: "Forbidden",
          description:
            "You don't have permission to access this page. Please contact support if you think this is a mistake.",
        };
      case 404:
        return {
          title: "Page Not Found",
          description:
            "The page you are looking for doesn't exist or has been moved.",
        };
      case 500:
        return {
          title: "Server Error",
          description:
            "Something went wrong on our end. Please try again later or contact support.",
        };
      case 503:
        return {
          title: "Service Unavailable",
          description:
            "The server is temporarily unavailable. Please try again in a few minutes.",
        };
      default:
        return {
          title: errorMessage,
          description: errorDescription,
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <section className="error_container">
      <div className="error_holder">
        <div className="logo_container">
          <img
            src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
            alt="Taskify Logo"
            className="taskify_logo"
          />
        </div>

        <div className="error_icon">
          <MdErrorOutline />
        </div>

        <div className="error_code">
          <span className="error_number">{errorCode}</span>
        </div>

        <div className="error_text">
          <h1>{errorDetails.title}</h1>
          <p>{errorDetails.description}</p>
        </div>

        <div className="error_actions">
          <button className="error_btn primary" onClick={() => navigate("/signup")}>
            <IoHomeOutline />
            Go to Sign Up
          </button>

          <button className="error_btn secondary" onClick={() => navigate(-1)}>
            <IoArrowBackOutline />
            Go Back
          </button>
        </div>

        <p className="error_help">
          Need help?{" "}
          <span onClick={() => navigate("/login")}>Contact Support</span>
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;
