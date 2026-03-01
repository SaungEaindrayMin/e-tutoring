import { LogoutOutlined, Menu } from "@mui/icons-material";
import { AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material";
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Topbar = ({ drawerWidth, isDesktop, onMenuClick }) => {
  const navigate = useNavigate();
  const config = new Configuration();
  const dataService = new DataServices();

  const handleLogout = async () => {
    try {
      const serviceName = config.SERVICE_NAME + config.SERVICE_LOGOUT;
      const response = await dataService.retrievePOST({}, serviceName);

      console.log("Logout response:", response);
      Cookies.remove(config.COOKIE_NAME_TOKEN, { path: "/" });

      navigate("/login"); 
      
    } catch (error) {
      console.error("Logout failed", error);
      Cookies.remove(config.COOKIE_NAME_TOKEN, { path: "/" });
      navigate("/login");
    }
  };
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isDesktop && (
            <IconButton onClick={onMenuClick}>
              <Menu />
            </IconButton>
          )}

          <Box>
            <Typography fontWeight={600}>Welcome back, Alice!</Typography>
            <Typography variant="body2" color="text.secondary">
              Here your personal tutoring overview
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box textAlign="right">
            <Typography fontWeight={500}>Alice Johnson</Typography>
            <Typography variant="body2" color="text.secondary">
              Student
            </Typography>
          </Box>

          <IconButton onClick={handleLogout}>
            <LogoutOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
