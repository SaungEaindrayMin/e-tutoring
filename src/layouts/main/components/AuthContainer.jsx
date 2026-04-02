import { Box, Card, CardContent, Typography } from "@mui/material";

const AuthContainer = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: { xs: 300, sm: 400, md: 600 },
          height: { xs: 300, sm: 400, md: 600 },
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 500, md: 900, lg: 1000 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 0.5,
          overflow: "hidden",
          bgcolor: "#fff",
          p: { xs: 0, sm: 1 },
          boxShadow: `
            0 10px 30px rgba(0,0,0,0.08),
            0 20px 60px rgba(0,0,0,0.06),
            0 40px 120px rgba(99,102,241,0.15)
          `,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "80%" },
            display: { xs: "none", md: "flex" },
            borderRadius: 0.5,
            flexDirection: "column",
            justifyContent: "space-between",
            p: { md: 3, lg: 4 },
            color: "#fff",
            position: "relative",
            background: `
              radial-gradient(at 20% 20%, rgba(255,255,255,0.22) 0px, transparent 50%),
              radial-gradient(at 80% 80%, rgba(255,255,255,0.12) 0px, transparent 50%),
              linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)
            `,
          }}
        >
          <Typography fontSize={{ md: 32, lg: 40 }}>✱</Typography>

          <Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              You can easily
            </Typography>

            <Typography
              sx={{
                fontSize: { md: "1rem", lg: "1.5rem" },
                fontWeight: 600,
                mt: 1,
                lineHeight: 1.3,
              }}
            >
              Access your personal e-tutoring hub for clarity and productivity
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <CardContent
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: 420 },
              p: { xs: 3, sm: 4, md: 5 },
            }}
          >
            {children}
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default AuthContainer;
