import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import StatsCard from "../../../layouts/main/components/StatsCard";
import { useState } from "react";
import {
  AccessTime,
  CalendarTodayOutlined,
  ChatBubbleOutline,
  CheckCircleOutline,
  Close,
  DescriptionOutlined,
  Person,
  PersonOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MeetingStatisticsChart from "./MeetingStatisticsChart";
import ActivityTrendsChart from "./ActivityTrendsChart";


const ProgressRow = ({ label, value }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>{value}%</Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{ mt: 1, height: 6, borderRadius: 1 }}
    />
  </Box>
);

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const goToMessage = () => navigate("/admin/messages");
  const goToMeeting = () => navigate("/admin/meetings");
  const [loading, setLoading] = useState(false);

  return (
    <Box p={{ xs: 1.5, sm: 2 }}>
      {showWelcome && (
        <Box
          sx={{
            mt: 2,
            mb: 3,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2.5 },
            borderRadius: 1,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #5B9BD5 0%, #0F6CBD 100%)",
            color: "#fff",
          }}
        >
          <Box display="flex" alignItems="flex-start" gap={2}>
            <CheckCircleOutline sx={{ fontSize: { xs: 24, sm: 32 } }} />

            <Box>
              <Typography fontWeight={600} fontSize={{ xs: 16, sm: 18 }}>
                Welcome to the eTutoring System!
              </Typography>

              <Typography fontSize={{ xs: 13, sm: 14 }} sx={{ opacity: 0.9 }}>
                This is your first login. Explore the system anytime.
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={() => setShowWelcome(false)}
            sx={{ color: "#fff", alignSelf: { xs: "flex-end", sm: "center" } }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        }}
        gap={2}
      >
        <StatsCard
          title="Upcoming meetings"
          value={""}
          icon={<CalendarTodayOutlinedIcon sx={{ color: "text.message" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            boxShadow: "none",
            bgcolor: "background.green",
            color: "text.message",
          }}
        />

        <StatsCard
          title="Unread Messages"
          value={""}
          icon={<ChatBubbleOutline sx={{ color: "text.document" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            boxShadow: "none",
            bgcolor: "icon.document",
            color: "text.document",
          }}
        />

        <StatsCard
          title="Documents Shared"
          value={""}
          icon={<DescriptionOutlined sx={{ color: "text.warning" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            boxShadow: "none",
            bgcolor: "background.yellow",
            color: "text.warning",
          }}
        />

        <StatsCard
          title="Meeting Hours"
          value={""}
          icon={<AccessTime sx={{ color: "text.danger" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            boxShadow: "none",
            bgcolor: "background.red",
            color: "text.danger",
          }}
        />
      </Box>

      <Card sx={{ borderRadius: 1, height: "100%", mt: 2 }}>
        <Typography
          mb={2}
          sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
        >
          <PersonOutline />
          <Typography variant="body2" fontWeight={600}>
            Your Personal Tutor
          </Typography>
        </Typography>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { md: "space-between" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 72, height: 72, fontSize: 28 }}>DSB</Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700}>
                Dr. Sarah Brown
              </Typography>
              <Typography color="text.secondary">
                tutor@example.com
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              useGradient
              onClick={goToMessage}
              startIcon={<ChatBubbleOutlineOutlinedIcon />}
              sx={{ borderRadius: 0.5, py: 1.4, width: { xs: "100%", sm: "auto" } }}
            >
              Send Message
            </Button>

            <Button
              variant="outlined"
              onClick={goToMeeting}
              startIcon={<CalendarTodayOutlinedIcon />}
              sx={{ borderRadius: 0.5, py: 1.4, width: { xs: "100%", sm: "auto" } }}
            >
              Schedule Meetings
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "3fr 2fr" }}
        gap={2}
        mt={2}
      >
        {/* Upcoming Meetings */}
        <Card sx={{ borderRadius: 1, height: "100%" }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                mb={2}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CalendarTodayOutlined sx={{ color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={600}>
                  Upcoming Meetings
                </Typography>
              </Typography>
              <Button onClick={goToMeeting} sx={{ color: "text.secondary" }}>
                View All
              </Button>
            </Stack>

            <Card variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: "primary.active",
                      p: 1,
                      borderRadius: 0.5,
                      flexShrink: 0,
                      boxShadow: `
          0 6px 16px rgba(144, 210, 243, 0.35),
          0 12px 32px rgba(71, 187, 211, 0.3)
        `,
                    }}
                  >
                    <CalendarTodayOutlinedIcon
                      fontSize="large"
                      sx={{ color: "primary.main" }}
                    />
                  </Box>

                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={600}>
                      Academic Progress Review
                    </Typography>
                    <Typography color="text.secondary">
                      Feb 9, 2026 · 2:00 PM
                    </Typography>
                  </Box>

                  <Chip label="Virtual" sx={{ borderRadius: 0.5, flexShrink: 0 }} />
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: "primary.active",
                      p: 1,
                      borderRadius: 0.5,
                      flexShrink: 0,
                      boxShadow: `
          0 6px 16px rgba(144, 210, 243, 0.35),
          0 12px 32px rgba(71, 187, 211, 0.3)
        `,
                    }}
                  >
                    <CalendarTodayOutlinedIcon
                      fontSize="large"
                      sx={{ color: "primary.main" }}
                    />
                  </Box>

                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={600}>
                      Career Planning Discussion
                    </Typography>
                    <Typography color="text.secondary">
                      Feb 8, 2026 · 2:00 PM
                    </Typography>
                  </Box>

                  <Chip label="In-Person" sx={{ borderRadius: 0.5, flexShrink: 0 }} />
                </Stack>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card sx={{ borderRadius: 1, height: "100%" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography
                mb={2}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <ChatBubbleOutline sx={{ color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={600}>
                  Recent Messages
                </Typography>
              </Typography>
              <Button onClick={goToMessage} sx={{ color: "text.secondary" }}>
                View All
              </Button>
            </Stack>

            <Card variant="outlined" sx={{ borderRadius: 1 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={600}>Dr. Sarah Brown</Typography>
                    <Typography color="text.secondary">Feb 07</Typography>
                  </Stack>

                  <Typography color="text.secondary">
                    Hi! I reviewed your recent assignment. Great work on the
                    project structure.
                  </Typography>

                  <Chip
                    label="New"
                    size="small"
                    color="primary"
                    sx={{ width: "fit-content", borderRadius: 0.5 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
        mt={2}
      >
        <MeetingStatisticsChart />
        <ActivityTrendsChart />
      </Box>
    </Box>
  );
};

export default Dashboard;
