import { Card, Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

const MeetingStatisticsChart = () => {
  const weeks = [
    "1st week",
    "2nd week",
    "3rd week",
    "4th week",
    "5th week",
    "6th week",
  ];

  return (
    <Card sx={{ borderRadius: 0.5, overflow: "hidden" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          background: "linear-gradient(90deg, #F3E5F5, #B5B2F1)",
        }}
      >
        <CalendarMonthOutlined color="primary" />
        <Box>
          <Typography fontWeight={600}>Weekly Meeting Statistics</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your weekly meeting performance
          </Typography>
        </Box>
      </Box>

      {/* CHART */}
      <Box p={2}>
        <LineChart
          height={300}
          xAxis={[{ scaleType: "point", data: weeks }]}
          series={[
            {
              data: [16, 21, 18, 14, 22, 24],
              label: "Completed",
              color: "#7C7CF8",
            },
            {
              data: [18, 23, 19, 15, 24, 26],
              label: "Scheduled",
              color: "#FF8A80",
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          sx={{
            "& .MuiChartsGrid-line": {
              strokeDasharray: "4 4",
              stroke: "#D1D5DB",
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default MeetingStatisticsChart;
