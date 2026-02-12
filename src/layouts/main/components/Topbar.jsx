import { LogoutOutlined } from "@mui/icons-material";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";
const drawerWidth = 240;

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Welcome back, Alice!
          </Typography>
          <Typography variant="body3" color="text.muted">
            Here your personal tutoring overview
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body1" fontWeight={500}>
              Alice Johnson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student
            </Typography>
          </Box>

          <LogoutOutlined sx={{ color: "text.muted", fontSize: 20 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
