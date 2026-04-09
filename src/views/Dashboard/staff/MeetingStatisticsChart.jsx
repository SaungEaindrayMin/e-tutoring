import { CalendarTodayOutlined } from "@mui/icons-material";
import { Card, Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const MeetingStatisticsChart = ({ weeklyStats }) => {
  const hasData = weeklyStats?.labels?.length > 0;
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
        {hasData ? (
          <LineChart
            height={400}
            series={[
              {
                id: "scheduled",
                label: "Scheduled",
                data: weeklyStats?.scheduled || [],
                area: true,
                baseline: 0,
                showMark: true,
                curve: "monotoneX",
                color: "#8979FF",
              },
              {
                id: "completed",
                label: "Completed",
                data: weeklyStats?.completed || [],
                showMark: true,
                curve: "monotoneX",
                color: "#FF00C3",
              },
            ]}
            xAxis={[
              {
                scaleType: "band",
                data: weeklyStats?.labels || [],
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
        ) : (
          <Typography textAlign="center" py={5} color="text.secondary">
            No weekly data available
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default MeetingStatisticsChart;
