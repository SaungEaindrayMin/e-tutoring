import { LogoutOutlined, Menu } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CustomDialog from "../../main/components/CustomDialog";

const Topbar = ({ drawerWidth, isDesktop, onMenuClick }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [prevScroll, setPrevScroll] = useState(0);
  const [visible, setVisible] = useState(true);

  const config = new Configuration();
  const dataService = new DataServices();

  const formatRole = (role) =>
    role ? role.charAt(0) + role.slice(1).toLowerCase() : "";

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      const serviceName = config.SERVICE_NAME + config.SERVICE_LOGOUT;
      await dataService.retrievePOST({}, serviceName);
      Cookies.remove(config.COOKIE_NAME_TOKEN, { path: "/" });
      navigate("/login");
    } catch {
      Cookies.remove(config.COOKIE_NAME_TOKEN, { path: "/" });
      navigate("/login");
    }
  };

  useEffect(() => {
    const name = sessionStorage.getItem("userName");
    const role = sessionStorage.getItem("userRole");
    if (name) setUserName(name);
    if (role) setUserRole(role);

    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(prevScroll > current || current < 50);
      setPrevScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.7)",
          borderBottom: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          color: "text.primary",
          transition: "top 0.3s ease",
          top: visible ? 0 : "-80px",
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, md: 3 },
            py: 1.5,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            {!isDesktop && (
              <IconButton
                onClick={onMenuClick}
                sx={{
                  borderRadius: "10px",
                  background: "rgba(124,58,237,0.10)",
                  backdropFilter: "blur(6px)",
                  "&:hover": { background: "rgba(124,58,237,0.15)" },
                }}
              >
                <Menu />
              </IconButton>
            )}

            <Box>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "0.95rem", md: "1rem" } }}
              >
                Welcome back, {userName || "User"} 👋
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: "#64748B",
                  fontSize: "0.85rem",
                }}
              >
                {formatRole(userRole) || "Role"} Dashboard
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              px={1.5}
              py={0.5}
              borderRadius="999px"
              sx={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.15)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: "0.85rem",
                }}
              >
                {userName?.[0] || "U"}
              </Avatar>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {userName || "User"}
              </Typography>
            </Box>

            {/* Logout Button */}
            <IconButton
              onClick={() => setOpenLogoutDialog(true)}
              sx={{
                borderRadius: "10px",
                background: "rgba(239,68,68,0.08)",
                transition: "0.25s",
                "&:hover": {
                  background: "rgba(239,68,68,0.15)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <LogoutOutlined />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <CustomDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        title={
          <Typography
            variant="h6"
            fontWeight={600}
            color="error.main"
            textAlign="center"
          >
            Logout
          </Typography>
        }
      >
        <Box textAlign="center">
          <Typography color="text.secondary" mb={3}>
            Are you sure you want to logout?
          </Typography>

          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "text.secondary",
                color: "text.secondary",
                border: 0.5,
              }}
              onClick={() => setOpenLogoutDialog(false)}
            >
              Cancel
            </Button>

            <Button
              variant="outlined"
              sx={{
                bgcolor: "primary.main",
                boxShadow: "none",
                color: "background.paper",
              }}
              onClick={handleLogout}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </>
  );
};

export default Topbar;
