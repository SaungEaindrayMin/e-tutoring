import { Card, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { CalendarTodayOutlined } from "@mui/icons-material";

const ActivityTrendsChart = ({ data }) => {
  const weeks = [
    "1st week",
    "2nd week",
    "3rd week",
    "4th week",
    "5th week",
    "6th week",
    "7th week",
  ];

  const meetings = data.find((d) => d.label === "meetings")?.value || 0;
  const documents = data.find((d) => d.label === "documents")?.value || 0;
  const blogs = data.find((d) => d.label === "blogs")?.value || 0;

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
          <Typography fontWeight={600}>Activity Trends</Typography>
          <Typography variant="body2" color="text.secondary">
            Your monthly engagement with your students
          </Typography>
        </Box>
      </Box>

      <Box p={1}>
        <BarChart
          height={400}
          xAxis={[{ scaleType: "band", data: weeks }]}
          series={[
            {
              label: "Total Meetings",
              data: Array(7).fill(meetings),
            },
            {
              label: "Total Documents",
              data: Array(7).fill(documents),
            },
            {
              label: "Total Blogs",
              data: Array(7).fill(blogs),
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
              rx: 0.5,
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default ActivityTrendsChart;
