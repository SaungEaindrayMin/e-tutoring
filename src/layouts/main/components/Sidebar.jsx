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
import { FiCalendar, FiGrid, FiMessageSquare, FiFileText, FiBookOpen, FiUsers } from "react-icons/fi";

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isDesktop }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FiGrid />, path: "/admin" },
    { name: "Messages", icon: <FiMessageSquare />, path: "/admin/messages" },
    { name: "Meetings", icon: <FiCalendar />, path: "/admin/meetings" },
    { name: "Documents", icon: <FiFileText />, path: "/admin/documents" },
    { name: "Blog", icon: <FiBookOpen />, path: "/admin/blog" },
    { name: "Allocate Tutor", icon: <FiUsers />, path: "/admin/allocate-tutor" },
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ px: 3, display: "flex", gap: 1, my: 2 }}>
        <img src={logo} width={45} />
        <Box>
          <Typography fontWeight={600}>eTutor</Typography>
          <Typography variant="caption" color="text.secondary">
            Personal Tutoring System
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.name}
              onClick={() => {
                navigate(item.path);
                onClose();
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
              <ListItemIcon sx={{ color: active ? "text.active" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          );
        })}
      </List>
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
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
