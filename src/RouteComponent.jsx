import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/login/Login";
import ForgetPassword from "./views/login/ForgetPassword";
import OtpVerify from "./views/login/OtpVerify";
import ChangePassword from "./views/login/ChangePassword";
import Verify from "./views/login/Verify";
import Main from "./layouts/main/Main";
import ProtectedRoute from "./layouts/main/ProtectedRoute";
import Meeting from "./views/meeting/Meeting";
import UserList from "./views/user/UserList";
import Message from "./views/message/Message";
import BlogList from "./views/blog/BlogList";
import BlogDetail from "./views/blog/BlogDetail";
import Allocate from "./views/allocate/Allocate";
import Analytics from "./views/analytics/Analytics";
import TutorDashboard from "./views/Dashboard/tutor/TutorDashboard";
import AdminDashboard from "./views/Dashboard/admin/AdminDashboard";
import Dashboard from "./views/Dashboard/student/Dashboard";

const getDefaultRoute = () => {
  const role = sessionStorage.getItem("userRole");

  switch (role) {
    case "ADMIN":
      return "admin-dashboard";
    case "TUTOR":
      return "tutor-dashboard";
    case "STUDENT":
      return "student-dashboard";
    default:
      return "/login";
  }
};

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
          <Route index element={<Navigate to={getDefaultRoute()} replace />} />
          <Route path="/admin/student-dashboard" element={<Dashboard />} />
          <Route path="/admin/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/admin/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/messages" element={<Message />} />
          <Route path="/admin/blog" element={<BlogList />} />
          <Route path="/admin/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin/allocate-tutor" element={<Allocate />} />
          <Route path="/admin/visit-analytics" element={<Analytics />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouteComponent;
