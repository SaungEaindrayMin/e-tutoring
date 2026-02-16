import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Configuration from "../../services/configuration";

const ProtectedRoute = () => {
  const config = new Configuration();
  const token = Cookies.get(config.COOKIE_NAME_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
