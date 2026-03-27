import { Box, Card, CardContent, useTheme, Typography } from "@mui/material";
import tutor3D from "../../../assets/images/3D.png";
const AuthContainer = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
      <Card
        sx={{
          width: "100%",
          maxWidth: 1000,
          display: "flex",
          borderRadius: 1.5,
          overflow: "hidden",
          bgcolor: "#fff",
          border: "1px solid rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          p: 1,
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
            width: "50%",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 4,
            borderRadius: 1.5,
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            background: `
  radial-gradient(at 20% 20%, rgba(255,255,255,0.22) 0px, transparent 50%),
  radial-gradient(at 80% 80%, rgba(255,255,255,0.12) 0px, transparent 50%),
  linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)
`,

            boxShadow: "inset 0 0 140px rgba(255,255,255,0.12)",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 300,
              height: 300,
              background: "rgba(124,58,237,0.25)",
              filter: "blur(90px)",
              top: -100,
              left: -100,
            },

            "&::after": {
              content: '""',
              position: "absolute",
              width: 300,
              height: 300,
              background: "rgba(37,99,235,0.25)",
              filter: "blur(110px)",
              bottom: -120,
              right: -120,
            },
          }}
        >
          <Typography fontSize={40}>✱</Typography>

          {/* <Box
            component="img"
            src={tutor3D}
            alt="3D tutoring illustration"
            sx={{
              width: "80%",
              maxWidth: 320,
              mx: "auto",
              mt: 2,
              mb: 2,
              position: "relative",
              zIndex: 2,
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))",
            }}
          /> */}

          <Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              You can easily
            </Typography>

            <Typography
              variant="h3"
              sx={{ fontWeight: 600, mt: 1, lineHeight: 1.3 }}
            >
              Access your personal e-tutoring hub for clarity and
              productivity{" "}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "55%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <CardContent
            sx={{
              width: "100%",
              maxWidth: 420,
              p: { xs: 3, sm: 4 },
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
