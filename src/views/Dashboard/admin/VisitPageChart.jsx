import { CalendarTodayOutlined } from "@mui/icons-material";
import { Card, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const VisitPageChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const pages = [
    "Dashboard",
    "Meetings",
    "Docs",
    "Blog",
    "Allocate",
    "Create",
    "Analytics",
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
    <Card sx={{ borderRadius: 1, overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: { xs: 1.5, sm: 2 },
          background: "linear-gradient(90deg, #F3E5F5, #B5B2F1)",
        }}
      >
        <CalendarTodayOutlined color="primary" />

        <Box>
          <Typography fontWeight={600} fontSize={{ xs: 14, sm: 16 }}>
            Visits by Page
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            fontSize={{ xs: 12, sm: 14 }}
          >
            Activity across different pages
          </Typography>
        </Box>
      </Box>

      {/* CHART */}
      <Box p={{ xs: 1, sm: 2 }}>
        <BarChart
          height={isMobile ? 260 : 400} 
          xAxis={[
            {
              scaleType: "band",
              data: pages,
              tickLabelStyle: {
                angle: isMobile ? -30 : 0,
                textAnchor: isMobile ? "end" : "middle",
                fontSize: isMobile ? 10 : 12,
              },
            },
          ]}
          series={[{ data: values }]}
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
              rx: 2,
            },

            "& .MuiBarElement-root:nth-of-type(1)": { fill: colors[0] },
            "& .MuiBarElement-root:nth-of-type(2)": { fill: colors[1] },
            "& .MuiBarElement-root:nth-of-type(3)": { fill: colors[2] },
            "& .MuiBarElement-root:nth-of-type(4)": { fill: colors[3] },
            "& .MuiBarElement-root:nth-of-type(5)": { fill: colors[4] },
            "& .MuiBarElement-root:nth-of-type(6)": { fill: colors[5] },
            "& .MuiBarElement-root:nth-of-type(7)": { fill: colors[6] },
          }}
        />
      </Box>
    </Card>
  );
};

export default VisitPageChart;
