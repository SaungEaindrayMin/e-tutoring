import { Box, Card, useTheme } from "@mui/material";

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
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
        }}
      >
        {children}
      </Card>
    </Box>
  );
};

export default AuthContainer;
