import { Route, Routes } from "react-router-dom";
import Login from "./views/login/Login";
import ForgetPassword from "./views/login/ForgetPassword";
import OtpVerify from "./views/login/OtpVerify";
import ChangePassword from "./views/login/ChangePassword";
import Verify from "./views/login/Verify";

const RouteComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/email-otp-verify" element={<OtpVerify />} />
      <Route path="/verify-success" element={<Verify />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
};

export default RouteComponent;
