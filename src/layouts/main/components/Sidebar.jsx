import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/icon.svg";
import {
  FiCalendar,
  FiGrid,
  FiMessageSquare,
  FiFileText,
  FiBookOpen,
  FiUsers,
} from "react-icons/fi";
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";
import { useEffect, useState } from "react";

const SOFT_GLASS_GRADIENT =
  "linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(147,197,253,0.15) 50%, rgba(96,165,250,0.15) 100%)";

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isDesktop }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = new Configuration();
  const dataService = new DataServices();

  const [menuItems, setMenuItems] = useState([
    "Dashboard",
    "Messages",
    "Meetings",
    "Documents",
    "Blog",
    "Allocate Tutor",
  ]);
  const [loading, setLoading] = useState(true);

  const tabConfig = {
    dashboard: {
      path: "/admin/admin-dashboard",
      icon: <FiGrid />,
      label: "Dashboard",
    },
    tutor_dashboard: {
      path: "/admin/tutor-dashboard",
      icon: <FiGrid />,
      label: "Dashboard",
    },
    student_dashboard: {
      path: "/admin/student-dashboard",
      icon: <FiGrid />,
      label: "Dashboard",
    },
    messages: {
      path: "/admin/messages",
      icon: <FiMessageSquare />,
      label: "Messages",
    },
    meetings: {
      path: "/admin/meetings",
      icon: <FiCalendar />,
      label: "Meetings",
    },
    documents: {
      path: "/admin/documents",
      icon: <FiFileText />,
      label: "Documents",
    },
    blog: { path: "/admin/blog", icon: <FiBookOpen />, label: "Blog" },
    allocate: {
      path: "/admin/allocate-tutor",
      icon: <FiUsers />,
      label: "Allocate Tutor",
    },
    account: {
      path: "/admin/users",
      icon: <FiUsers />,
      label: "Account",
    },
    analytics: {
      path: "/admin/visit-analytics",
      icon: <FiUsers />,
      label: "Visit Analytics",
    },
  };

  useEffect(() => {
    const fetchSidebar = async () => {
      const role = sessionStorage.getItem("userRole");
      if (!role) {
        setLoading(false);
        return;
      }

      try {
        const response = await dataService.retrieve(
          config.SERVICE_NAME + config.SERVICE_SIDEBAR,
          `?role=${role}`,
        );

        if (
          response?.status === "success" &&
          Array.isArray(response.data?.tabs)
        ) {
          setMenuItems(response.data.tabs);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Sidebar error:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebar();
  }, []);

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.75)",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* LOGO */}
      <Box sx={{ px: 3, py: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <img src={logo} width={45} alt="logo" />
        <Box>
          <Typography fontWeight={700}>eTutoring</Typography>
          <Typography variant="caption" color="text.secondary">
            Personal Tutoring System
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <List sx={{ px: 1, flexGrow: 1 }}>
          {menuItems.map((tab) => {
            const key = tab.toLowerCase();
            const configItem = tabConfig[key];
            if (!configItem) return null;

            const active = location.pathname.startsWith(configItem.path);

            return (
              <ListItemButton
                key={key}
                onClick={() => {
                  navigate(configItem.path);
                  if (onClose) onClose();
                }}
                selected={active}
                sx={{
                  borderRadius: 0.5,
                  mb: 1,
                  py: 1.25,
                  px: 2,
                  color: active ? "#1E293B" : "#475569",
                  background: active ? SOFT_GLASS_GRADIENT : "transparent",
                  backdropFilter: active ? "blur(10px)" : "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: active
                      ? SOFT_GLASS_GRADIENT
                      : "rgba(124,58,237,0.06)",
                    backdropFilter: active ? "blur(10px)" : "blur(6px)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "primary.active",
                    color: "text.active",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: 36,
                    color: active ? "text.active" : "#94A3B8",
                  },
                  "& .MuiListItemText-root .MuiTypography-root": {
                    fontWeight: 500,
                  },
                }}
              >
                <ListItemIcon>{configItem.icon}</ListItemIcon>
                <ListItemText primary={configItem.label} />
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Box>
  );

  return (
    <>
      {/* MOBILE */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* DESKTOP */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
