import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/images/icon.svg";
import { FiCalendar, FiGrid, FiMessageSquare,FiFileText,FiBookOpen,FiUsers } from "react-icons/fi";
const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid />, path: "/admin" },
    { name: "Messages", icon: <FiMessageSquare />, path: "/admin/messages" },
    { name: "Meetings", icon: <FiCalendar />, path: "/admin/meetings" },
    { name: "Documents", icon: <FiFileText />, path: "/admin/documents" },
    { name: "Blog", icon: <FiBookOpen />, path: "/admin/blog" },
    {
      name: "Allocate Tutor",
      icon: <FiUsers />,
      path: "/admin/allocate-tutor",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderRight: "1px solid text.secondary",
        },
      }}
    >
      {" "}
      <Box
        sx={{ px: 3, display: "flex", alignItems: "flex-start", gap: 1, my: 2 }}
      >
        <img src={logo} alt="logo" width={50} />
        <Box>
          <Typography variant="body1" fontWeight={600}>
            eTutor
          </Typography>
          <Typography variant="body3" color="text.muted">
            Personal Tutoring System
          </Typography>
        </Box>
      </Box>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.name}
              onClick={() => navigate(item.path)}
              selected={isActive}
              sx={{
                borderRadius: 0.5,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.active",
                  color: "text.active",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 35,
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
