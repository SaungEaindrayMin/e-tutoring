import { Box, Stack } from "@mui/material";
import StatsCards from "./StatsCards";
import AnalyticsTabs from "./AnalyticsTabs";


const Analytics = () => {
  return (
    <Box>
      <Stack spacing={3}>
        <StatsCards />
        <AnalyticsTabs />
      </Stack>
    </Box>
  );
};

export default Analytics;
