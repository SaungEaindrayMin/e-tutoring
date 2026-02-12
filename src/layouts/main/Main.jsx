import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const Main = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box
          component="main"
          sx={{
            bgcolor: "background.paper",
            p: 4,
            minHeight: "100vh",
          }}
        >
          <Toolbar />

          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
