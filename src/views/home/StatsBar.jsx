import { Box, Container, Grid, Typography } from "@mui/material";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";

const STATS = [
  { value: "500+", label: "Active Students" },
  { value: "80+", label: "Expert Tutors" },
  { value: "1,200+", label: "Sessions Completed" },
  { value: "15+", label: "Subjects Covered" },
];

const StatsBar = () => {
  return (
    <Box sx={{ background: GRADIENT, py: 4 }}>
      <Container maxWidth="lg">
        <Grid container justifyContent="center" spacing={2}>
          {STATS.map((s) => (
            <Grid item xs={6} sm={3} key={s.label} sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  color: "#fff",
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                }}
              >
                {s.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.80)",
                  mt: 0.5,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsBar;
