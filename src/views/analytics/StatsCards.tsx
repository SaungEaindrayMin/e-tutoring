import { Box, Card, Typography, CircularProgress } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import DescriptionIcon from "@mui/icons-material/Description";
import PublicIcon from "@mui/icons-material/Public";

type StatsData = {
  totalVisit: number;
  uniquePages: number;
  browsers: number;
};

type StatsCardsProps = {
  data: StatsData;
  loading: boolean;
};

const StatsCards = ({ data, loading }: StatsCardsProps) => {

  const cards = [
    {
      title: "Total Visit",
      value: data.totalVisit,
      icon: <TimelineIcon sx={{ color: "#7C3AED" }} />,
      bg: "#F3E8FF",
    },
    {
      title: "Unique pages",
      value: data.uniquePages,
      icon: <DescriptionIcon sx={{ color: "#4F46E5" }} />,
      bg: "#EEF2FF",
    },
    {
      title: "Browsers Used",
      value: data.browsers,
      icon: <PublicIcon sx={{ color: "#6D28D9" }} />,
      bg: "#F5F3FF",
    },
  ];

  return (
    <Box
      display="flex"
      border={0.5}
      borderColor={"text.secondary"}
      borderRadius={0.5}
      p={2}
      flexDirection={{ xs: "column", md: "row" }}
      gap={2}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            borderRadius: 0.5,
            boxShadow: "none",
            bgcolor: card.bg,
          }}
        >
          {card.icon}
          <Typography variant="body2" color="text.secondary">
            {card.title}
          </Typography>{" "}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4" fontWeight={600}>
                {card.value}
              </Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default StatsCards;
