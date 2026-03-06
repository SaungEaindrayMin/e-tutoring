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

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isDesktop }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const config = new Configuration();
  const dataService = new DataServices();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabConfig = {
    dashboard: {
      path: "/admin",
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
    blog: {
      path: "/admin/blog",
      icon: <FiBookOpen />,
      label: "Blog",
    },
    "allocate tutor": {
      path: "/admin/allocate-tutor",
      icon: <FiUsers />,
      label: "Allocate Tutor",
    },
    account: {
      path: "/admin/users",
      icon: <FiUsers />,
      label: "Create Account",
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
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ px: 3, display: "flex", gap: 1, my: 2 }}>
        <img src={logo} width={45} alt="logo" />
        <Box>
          <Typography fontWeight={600}>eTutor</Typography>
          <Typography variant="caption" color="text.secondary">
            Personal Tutoring System
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <List sx={{ px: 2 }}>
          {menuItems.map((tab) => {
            const key = tab.toLowerCase();
            const configItem = tabConfig[key];

            if (!configItem) return null;

            const active = location.pathname === configItem.path;

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
                  "&.Mui-selected": {
                    bgcolor: "primary.active",
                    color: "text.active",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "text.active" : "text.secondary",
                    minWidth: 36,
                  }}
                >
                  {configItem.icon}
                </ListItemIcon>

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
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
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
