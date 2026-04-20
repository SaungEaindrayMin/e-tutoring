import { Card, Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { CalendarTodayOutlined } from "@mui/icons-material";

const ActivityTrendsChart = ({ data }) => {
  const labels = data?.labels || [];
  const meetings = data?.meetings || [];
  const documents = data?.documents || [];
  const blogs = data?.blogs || [];

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
          xAxis={[{ scaleType: "band", data: labels }]}
          series={[
            {
              label: "Total Meetings",
              data: meetings,
            },
            {
              label: "Total Documents",
              data: documents,
            },
            {
              label: "Total Blogs",
              data: blogs,
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
              rx: 4,
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default ActivityTrendsChart;
