import { Card, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

const ActivityTrendsChart = () => {
  const weeks = [
    "1st week",
    "2nd week",
    "3rd week",
    "4th week",
    "5th week",
    "6th week",
    "7th week",
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
          <Typography fontWeight={600}>Activity Trends</Typography>
          <Typography variant="body2" color="text.secondary">
            Your monthly engagement with your students
          </Typography>
        </Box>
      </Box>

      {/* CHART */}
      <Box p={2}>
        <BarChart
          height={300}
          xAxis={[{ scaleType: "band", data: weeks }]}
          series={[
            {
              label: "Total Meetings",
              data: [7, 5, 8, 6, 7, 11, 6],
              color: "#7C7CF8",
            },
            {
              label: "Total Documents",
              data: [12, 18, 14, 21, 16, 28, 20],
              color: "#FF8A80",
            },
            {
              label: "Total Blogs",
              data: [8, 11, 7, 14, 12, 21, 11],
              color: "#4DD0E1",
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          sx={{
            "& .MuiChartsGrid-line": {
              strokeDasharray: "4 4",
              stroke: "#D1D5DB",
            },
            "& .MuiBarElement-root": {
              rx: 4,
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default ActivityTrendsChart;
