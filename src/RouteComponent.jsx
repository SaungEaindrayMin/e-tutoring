import { Route, Routes } from "react-router-dom";
import Login from "./views/login/Login";
import ForgetPassword from "./views/login/ForgetPassword";
import OtpVerify from "./views/login/OtpVerify";
import ChangePassword from "./views/login/ChangePassword";
import Verify from "./views/login/Verify";
import Main from "./layouts/main/Main";
import ProtectedRoute from "./layouts/main/ProtectedRoute";
import Meeting from "./views/meeting/Meeting";
import Dashboard from "./views/Dashboard/Dashboard";
import Message from "./views/message/Message";


const RouteComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/email-otp-verify" element={<OtpVerify />} />
      <Route path="/verify-success" element={<Verify />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="meetings" element={<Meeting />} />
          <Route path="messages" element={<Message />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouteComponent;
