import { Card, Typography, Box, CircularProgress } from "@mui/material";

const StatsCard = ({ title, value, icon, loading, sx = {} }) => {
  return (
    <Card
      sx={{
        flex: 1,
        p: { xs: 2, sm: 3 },
        boxShadow: "xs",
        border: 0.5,
        borderColor: "text.input",
        borderRadius: 0.5,
        ...sx,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h4">{value}</Typography>
        )}

        {icon}
      </Box>
    </Card>
  );
};

export default StatsCard;
