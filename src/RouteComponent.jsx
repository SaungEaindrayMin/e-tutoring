import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./views/login/Login";
import ForgetPassword from "./views/login/ForgetPassword";
import OtpVerify from "./views/login/OtpVerify";
import ChangePassword from "./views/login/ChangePassword";
import Verify from "./views/login/Verify";
import Main from "./layouts/main/Main";
import ProtectedRoute from "./layouts/main/ProtectedRoute";
import Dashboard from "./views/Dashboard/Dashboard";
import Meeting from "./views/meeting/Meeting";
import UserList from "./views/user/UserList";
import Message from "./views/message/Message";
import BlogList from "./views/blog/BlogList";
import BlogDetail from "./views/blog/BlogDetail";
import Allocate from "./views/allocate/Allocate";
import Analytics from "./views/analytics/Analytics";
import DataServices from "./services/data-services";
import Configuration from "./services/configuration";

const dataService = new DataServices();
const config = new Configuration();

const EXCLUDED_ACTIVITY_PATHS = new Set([
  "/",
  "/login",
  "/forget-password",
  "/email-otp-verify",
  "/verify-success",
]);

const PAGE_NAME_BY_PATH = {
  "/": "Login",
  "/login": "Login",
  "/forget-password": "Forget Password",
  "/email-otp-verify": "OTP Verify",
  "/verify-success": "Verify",
  "/change-password": "Change Password",
  "/admin": "Dashboard",
  "/admin/meetings": "Meetings",
  "/admin/users": "Create Account",
  "/admin/messages": "Messages",
  "/admin/blog": "Blog",
  "/admin/allocate-tutor": "Allocate Tutor",
  "/admin/visit-analytics": "Visit Analytics",
  "/admin/documents": "Documents",
};

const toTitleCase = (value) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getPageNameFromPath = (pathname) => {
  if (pathname.startsWith("/admin/blog/")) {
    return "Blog";
  }

  if (PAGE_NAME_BY_PATH[pathname]) {
    return PAGE_NAME_BY_PATH[pathname];
  }

  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length) {
    return "Home";
  }

  return toTitleCase(segments[segments.length - 1]);
};

const RouteComponent = () => {
  const location = useLocation();

  useEffect(() => {
    if (EXCLUDED_ACTIVITY_PATHS.has(location.pathname)) {
      return;
    }

    const pageName = getPageNameFromPath(location.pathname);
    const serviceName = config.SERVICE_NAME + config.SERVICE_USER_ACTIVITY;

    dataService.retrievePOST({ page: pageName }, serviceName).catch((error) => {
      console.error("Failed to track user activity:", error);
    });
  }, [location.pathname]);

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
          <Route path="/admin/meetings" element={<Meeting />} />
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
