import { Card, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { CalendarTodayOutlined } from "@mui/icons-material";

const MeetingStatisticsChart = ({ data }) => {
  return (
    <Card sx={{ borderRadius: 0.5, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          background: "linear-gradient(90deg, #F3E5F5, #B5B2F1)",
        }}
      >
        <CalendarTodayOutlined sx={{ color: "#1976d2", fontSize: 28 }} />
        <Box>
          <Typography fontWeight={600}>Weekly Meeting Statistics</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your weekly meeting performance
          </Typography>
        </Box>
      </Box>

      <Box p={1}>
        <BarChart
          height={400}
          xAxis={[
            {
              scaleType: "band",
              data: data?.labels || [],
            },
          ]}
          series={[
            {
              label: "Scheduled",
              data: data?.scheduled || [],
              color: "#7C7CF8",
            },
            {
              label: "Completed",
              data: data?.completed || [],
              color: "#FF8A80",
            },
          ]}
          grid={{ horizontal: true, vertical: true }}
          slotProps={{
            legend: {
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
          sx={{
            "& .MuiChartsGrid-line": {
              strokeDasharray: "4 4",
              stroke: "#E5E7EB",
            },
            "& .MuiBarElement-root": {
              rx: 2,
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default MeetingStatisticsChart;
