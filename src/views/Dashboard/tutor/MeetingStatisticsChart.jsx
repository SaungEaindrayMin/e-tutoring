import { CalendarTodayOutlined } from "@mui/icons-material";
import { Card, Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

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
        <CalendarTodayOutlined color="primary" />
        <Box>
          <Typography fontWeight={600}>Weekly Meeting Statistics</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your weekly meeting performance
          </Typography>
        </Box>
      </Box>

      <Box p={1}>
        <LineChart
          height={400}
          xAxis={[
            {
              scaleType: "band",
              data: data?.labels || [],
            },
          ]}
          series={[
            {
              data: data?.completed || [],
              label: "Completed",
              color: "#7C7CF8",
            },
            {
              data: data?.scheduled || [],
              label: "Scheduled",
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
          }}
        />
      </Box>
    </Card>
  );
};

export default MeetingStatisticsChart;
