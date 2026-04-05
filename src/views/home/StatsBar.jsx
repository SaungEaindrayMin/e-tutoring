import { Box, Container, Grid, Typography } from "@mui/material";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";

const HIGHLIGHTS = [
  { title: "Active", subtitle: "Community" },
  { title: "Expert", subtitle: "Tutors" },
  { title: "Live", subtitle: "Sessions" },
  { title: "All", subtitle: "Subjects" },
];

const StatsBar = () => {
  return (
    <Box sx={{ background: GRADIENT, py: 4 }}>
      <Container maxWidth="lg">
        <Grid container justifyContent="center" spacing={2}>
          {HIGHLIGHTS.map((item) => (
            <Grid
              item
              xs={6}
              sm={3}
              key={item.title}
              sx={{ textAlign: "center" }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: "#fff",
                  fontSize: { xs: "1rem", md: "1.2rem" },
                }}
              >
                {item.title}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.80)",
                  mt: 0.5,
                  fontWeight: 400,
                }}
              >
                {item.subtitle}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsBar;
