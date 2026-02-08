import { Box, useTheme } from "@mui/material";

const AuthContainer = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default AuthContainer;
