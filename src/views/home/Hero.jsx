import { Box, Button, Chip, Container, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";
const GRADIENT_SOFT =
  "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(96,165,250,0.10) 50%, rgba(0,106,181,0.08) 100%)";

const Hero = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 10, md: 18 },
        pb: { xs: 10, md: 18 },
        textAlign: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: GRADIENT_SOFT,
          zIndex: 0,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(124,58,237,0.10)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(37,99,235,0.10)",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Chip
          label="🎓 Welcome to eTutoring Platform"
          size="small"
          sx={{
            mb: 3,
            px: 1.5,
            background: "rgba(124,58,237,0.10)",
            color: "#7C3AED",
            fontWeight: 600,
            fontSize: "0.78rem",
            border: "1px solid rgba(124,58,237,0.20)",
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.4rem", md: "3.5rem" },
            fontWeight: 800,
            lineHeight: 1.15,
            mb: 3,
            background: GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          Smarter Learning,
          <br />
          Better Outcomes
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.15rem" },
            color: "#475569",
            maxWidth: 560,
            mx: "auto",
            mb: 5,
            lineHeight: 1.75,
          }}
        >
          eTutoring connects students with expert tutors through a seamless
          platform built for modern education — with live sessions, smart
          scheduling, and real-time analytics.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            size="sm"
            endIcon={<ArrowForwardIcon />}
            onClick={goToLogin}
            sx={{ px: 2, py: 1, fontSize: "1rem" }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={goToLogin}
            sx={{
              px: 2,
              py: 1,
              fontSize: "1rem",
              border: "1px solid",
              borderColor: "#7C3AED",
              color: "#7C3AED",
              background: "transparent",
              backdropFilter: "blur(4px)",
              "&:hover": {
                background: "rgba(124,58,237,0.06)",
                borderColor: "#6D28D9",
              },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
