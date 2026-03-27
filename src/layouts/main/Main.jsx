import { Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const drawerWidth = 240;

const Main = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        isDesktop={isDesktop}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Topbar
          drawerWidth={drawerWidth}
          isDesktop={isDesktop}
          onMenuClick={handleDrawerToggle}
        />

        <Toolbar />

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 },
 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
