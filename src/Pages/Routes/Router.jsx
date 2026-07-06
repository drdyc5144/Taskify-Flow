import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Error/ErrorPage";
import Login from "../Auth/Login";
import SignUp from "../Auth/Signup";
import VerifyUser from "../Auth/VerifyUser";
import ForgotPassword from "../Auth/ForgotPassword";
import VerifyForgotOtp from "../Auth/VerifyForgotOtp";
import ResetPassword from "../Auth/ResetPassword";
import Dashboard from "../Dashboard/Dashboard";
import Analytics from "../Dashboard/Analytics";
import Profile from "../Dashboard/Profile";
import Notifications from "../Dashboard/Notifications";
import PrivateRoute from "../../Components/Private/PrivateRoute";
import PublicRoute from "../../Components/Private/PublicRoute";

export const Element = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-user",
    element: (
      <PublicRoute>
        <VerifyUser />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-forgot-otp",
    element: (
      <PublicRoute>
        <VerifyForgotOtp />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/analytics",
    element: (
      <PrivateRoute>
        <Analytics />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/notifications",
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
]);
