import { Box, Card, CardContent, useTheme } from "@mui/material";

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
          maxWidth: 450,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 },
            position:"relative"
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthContainer;
