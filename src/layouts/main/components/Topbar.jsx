import { LogoutOutlined, Menu } from "@mui/icons-material";
import { AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material";

const Topbar = ({ drawerWidth, isDesktop, onMenuClick }) => {
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

          <LogoutOutlined />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
