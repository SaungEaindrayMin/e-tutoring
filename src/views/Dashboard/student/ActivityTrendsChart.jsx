import { Card, Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

const ActivityTrendsChart = () => {
  const rawData = [
    { label: "Meetings", value: 50, color: "#7C7CF8" },
    { label: "Messages", value: 129, color: "#FF8A80" },
    { label: "Documents", value: 84, color: "#4DD0E1" },
  ];

  const total = rawData.reduce((sum, item) => sum + item.value, 0);

  const data = rawData.map((item, index) => ({
    id: index,
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
  }));

  return (
    <Card sx={{ borderRadius: 0.5, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          background: "linear-gradient(90deg, #F3E5F5, #B5B2F1)",
        }}
      >
        <CalendarMonthOutlined sx={{ color: "#1976d2", fontSize: 28 }} />
        <Box>
          <Typography fontWeight={600}>Activity Trends</Typography>
          <Typography variant="body2" color="text.secondary">
            Your monthly engagement with your students
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <PieChart
          height={300}
          series={[
            {
              data: data.map((d) => ({
                ...d,
                label: `${d.label} (${d.percentage}%)`, // 👈 label with %
              })),
              innerRadius: 70,
              outerRadius: 120,
              paddingAngle: 3,
              cornerRadius: 6,
            },
          ]}
          slotProps={{
            legend: {
              position: { vertical: "bottom", horizontal: "middle" },
            },
            tooltip: {
              trigger: "item",
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default ActivityTrendsChart;
