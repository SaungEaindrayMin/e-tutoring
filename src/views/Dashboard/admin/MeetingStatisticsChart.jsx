import { CalendarTodayOutlined } from "@mui/icons-material";
import { Card, Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const MeetingStatisticsChart = () => {
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

      <Box p={2}>
        <LineChart
          height={400}
          series={[
            {
              id: "scheduled",
              label: "Scheduled",
              data: [9, 15, 14, 9, 19, 14],
              area: true,
              baseline: 0,
              showMark: true,
              curve: "monotoneX",
              color: "#8979FF",
            },
            {
              id: "completed",
              label: "Completed",
              data: [6, 13, 12, 8, 17, 12],
              showMark: true,
              curve: "monotoneX",
              color: "#FF00C3",
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: [
                "Week 1",
                "Week 2",
                "Week 3",
                "Week 4",
                "Week 5",
                "Week 6",
              ],
            },
          ]}
          yAxis={[
            {
              min: 0,
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
          sx={{
            "& .MuiChartsGrid-line": {
              strokeDasharray: "4 4",
              stroke: "#D1D5DB",
            },

            "& .MuiAreaElement-series-scheduled": {
              fill: "url(#meetingGradient)",
            },

            "& .MuiMarkElement-root": {
              strokeWidth: 2,
              fill: "#fff",
            },
          }}
        >
          <defs>
            <linearGradient id="meetingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8979FF4D" />
              <stop offset="100%" stopColor="#FF00C333" />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Card>
  );
};

export default MeetingStatisticsChart;
