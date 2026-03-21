import { Box } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import DescriptionIcon from "@mui/icons-material/Description";
import PublicIcon from "@mui/icons-material/Public";
import { useEffect, useState } from "react";
import StatsCard from "../../layouts/main/components/StatsCard";

const StatsCards = () => {
  const [data, setData] = useState({
    totalVisit: 0,
    uniquePages: 0,
    browsers: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setData({
        totalVisit: 40,
        uniquePages: 4,
        browsers: 2,
      });
      setLoading(false);
    }, 800);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={2}
    >
      <StatsCard
        title="Total Visit"
        value={data.totalVisit}
        icon={<TimelineIcon sx={{ color: "#7C3AED" }} />}
        loading={loading}
        sx={{ bgcolor: "#F3E8FF", border: "none", boxShadow: "none" }}
      />

      <StatsCard
        title="Unique pages"
        value={data.uniquePages}
        icon={<DescriptionIcon sx={{ color: "#4F46E5" }} />}
        loading={loading}
        sx={{ bgcolor: "#EEF2FF", border: "none", boxShadow: "none" }}
      />

      <StatsCard
        title="Browsers Used"
        value={data.browsers}
        icon={<PublicIcon sx={{ color: "#6D28D9" }} />}
        loading={loading}
        sx={{ bgcolor: "#F5F3FF", border: "none", boxShadow: "none" }}
      />
    </Box>
  );
};

export default StatsCards;
