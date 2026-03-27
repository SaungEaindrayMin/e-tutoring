import { Card, Box, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";

const VisitPageChart = () => {
  const theme = useTheme();

  const pages = [
    "Dashboard",
    "Meetings",
    "Documents",
    "Blog",
    "Allocate Tutor",
    "Create account",
    "Visit Analytics",
  ];

  const values = [20, 16, 12, 8, 11, 5, 14];

  const colors = [
    theme.palette.chart.purple,
    theme.palette.chart.pink,
    theme.palette.chart.red,
    theme.palette.chart["deep-purple"],
    theme.palette.chart.blue,
    theme.palette.chart.yellow,
    theme.palette.chart.orange,
  ];

  return (
    <Card
      sx={{
        borderRadius: 0.5,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
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
          <Typography fontWeight={600}>Visits by Page</Typography>
          <Typography variant="body2" color="text.secondary">
            Activity across different pages
          </Typography>
        </Box>
      </Box>

      <Box p={2}>
        <BarChart
          height={300}
          xAxis={[
            {
              scaleType: "band",
              data: pages,
            },
          ]}
          series={[
            {
              data: values,
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          slotProps={{
            legend: { hidden: true },
          }}
          sx={{
            "& .MuiChartsGrid-line": {
              strokeDasharray: "4 4",
              stroke: "#D1D5DB",
            },

            "& .MuiBarElement-root": {
              rx: 1,
            },

            "& .MuiBarElement-root:nth-of-type(1)": {
              fill: colors[0],
            },
            "& .MuiBarElement-root:nth-of-type(2)": {
              fill: colors[1],
            },
            "& .MuiBarElement-root:nth-of-type(3)": {
              fill: colors[2],
            },
            "& .MuiBarElement-root:nth-of-type(4)": {
              fill: colors[3],
            },
            "& .MuiBarElement-root:nth-of-type(5)": {
              fill: colors[4],
            },
            "& .MuiBarElement-root:nth-of-type(6)": {
              fill: colors[5],
            },
            "& .MuiBarElement-root:nth-of-type(7)": {
              fill: colors[6],
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default VisitPageChart;
