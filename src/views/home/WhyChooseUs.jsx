import { Box, Container, Grid, Typography, Chip, Stack } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";

const BENEFITS = [
  "No scheduling conflicts — everything is managed in one place",
  "Real-time notifications for sessions and updates",
  "Secure, role-based access for all users",
  "Analytics to monitor progress and engagement",
];

const WhyChooseUs = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Chip
            label="Why Choose Us"
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
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 800,
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            A Smarter Way to Learn & Teach
          </Typography>

          <Typography
            sx={{
              color: "#475569",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Everything you need — learning, teaching, and managing — in one
            powerful and seamless platform.
          </Typography>
        </Box>
        ¥{" "}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                height: "100%",
                borderRadius: "24px",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography fontWeight={700} mb={1}>
                  Live Learning Experience
                </Typography>
                <Typography variant="h5" fontWeight={800} mb={2}>
                  Interactive Classes with Real Results
                </Typography>
                <Typography color="#475569">
                  Engage in real-time sessions with structured content,
                  collaborative tools, and instant feedback.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {BENEFITS.map((b, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "20px",
                      height: "100%",
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ color: "#7C3AED", mb: 1 }} />

                    <Typography sx={{ color: "#334155" }}>{b}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
