import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";
import Login from "../Auth/Login";
import SignUp from "../Auth/Signup";
import VerifyUser from "../Auth/VerifyUser";
import ForgotPassword from "../Auth/ForgotPassword";
import VerifyForgotOtp from "../Auth/VerifyForgotOtp";
import ResetPassword from "../Auth/ResetPassword";
import Dashboard from "../Dashboard/Dashboard";

export const Element = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/verify-user",
    element: <VerifyUser />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-forgot-otp",
    element: <VerifyForgotOtp />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
