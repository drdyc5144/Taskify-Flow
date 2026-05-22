import SignUp from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import VerifyUser from "./Pages/Auth/VerifyUser";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyUser />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
