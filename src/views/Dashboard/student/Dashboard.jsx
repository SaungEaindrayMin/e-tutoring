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
import { useEffect, useState } from "react";
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
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const goToMessage = () => navigate("/admin/messages");
  const goToMeeting = () => navigate("/admin/meetings");
  const [tutorData, setTutorData] = useState(null);
  const [tutorLoading, setTutorLoading] = useState(true);
  const studentId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [recentMessage, setRecentMessage] = useState(null);
  const config = new Configuration();
  const dataService = new DataServices();
  const [stats, setStats] = useState({
    upcomingMeetings: 0,
    unreadMessages: 0,
    documentsShared: 0,
    meetingHours: 0,
  });
  const [meetingStats, setMeetingStats] = useState({
    labels: [],
    scheduled: [],
    completed: [],
  });

  useEffect(() => {
    fetchMeetingStats();
  }, []);

  const fetchMeetingStats = async () => {
    const response = await dataService.retrieve(
      config.SERVICE_NAME,
      config.SERVICE_STUDENT_WEEKLY_MEETING_STATISTICS,
    );

    if (response?.status === "success") {
      const apiData = response.data || {};

      const labels = [];
      const scheduled = [];
      const completed = [];

      for (let i = 1; i <= 6; i++) {
        const key = `week${i}`;

        labels.push(`Week ${i}`);

        if (apiData[key]) {
          scheduled.push(apiData[key][0] || 0);
          completed.push(apiData[key][1] || 0);
        } else {
          scheduled.push(0);
          completed.push(0);
        }
      }

      setMeetingStats({
        labels,
        scheduled,
        completed,
      });
    } else {
      console.error(response?.message);
    }
  };

  const fetchUpcomingMeetings = async () => {
    try {
      const params = new URLSearchParams();
      params.append("studentId", studentId);
      params.append("limit", 10);
      params.append("page", 1);

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        `${config.SERVICE_SCHEDULE}?${params.toString()}`,
      );

      if (res?.status === "success") {
        const meetings = res.data || [];

        const filtered = meetings.filter((m) => m.isCompleted === false);

        const sorted = filtered.sort((a, b) => {
          const dateA = new Date(a.date + "T" + a.startTime);
          const dateB = new Date(b.date + "T" + b.startTime);
          return dateA - dateB;
        });
        const latestTwo = sorted.slice(0, 2);

        setUpcomingMeetings(latestTwo);
      }
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    }
  };

  const fetchRecentMessage = async () => {
    try {
      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        config.SERVICE_RECENT_MESSAGE,
      );

      if (res?.status === "success") {
        setRecentMessage(res.data || null);
      }
    } catch (error) {
      console.error("Failed to fetch recent message:", error);
    }
  };

  useEffect(() => {
    fetchActivityTrends();
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchUpcomingMeetings();
    }
  }, [studentId]);

  useEffect(() => {
    fetchRecentMessage();
  }, []);

  const fetchActivityTrends = async () => {
    const response = await dataService.retrieve(
      config.SERVICE_NAME,
      config.SERVICE_STUDENT_ACTIVITY_TRENDS,
    );

    if (response?.status === "success") {
      const apiData = response.data || [];

      const colorMap = {
        meetings: "#7C7CF8",
        messages: "#FF8A80",
        documents: "#4DD0E1",
      };

      const formatted = apiData.map((item) => ({
        id: item.id,
        label: item.label.charAt(0).toUpperCase() + item.label.slice(1),
        value: item.value || 0,
        color: colorMap[item.label] || "#ccc",
      }));

      setActivityData(formatted);
    } else {
      console.error(response?.message);
    }
  };

  useEffect(() => {
    const storedLastLogin = sessionStorage.getItem("lastLogin");
    setLastLogin(storedLastLogin);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    const response = await dataService.retrieve(
      config.SERVICE_NAME,
      config.SERVICE_STUDENT_STATS,
    );

    setLoading(false);

    if (response?.status === "success") {
      setStats(response.data);
    } else {
      console.error(response?.message);
    }
  };

  useEffect(() => {
    fetchTutor();
  }, []);

  const fetchTutor = async () => {
    setTutorLoading(true);

    const response = await dataService.retrieve(
      config.SERVICE_NAME,
      config.SERVICE_GET_STUDENT_TUTOR + studentId,
    );

    setTutorLoading(false);

    if (response?.status === "success") {
      setTutorData(response.data);
    } else {
      console.error(response?.message);
    }
  };

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
              {lastLogin ? (
                <>
                  {/* ✅ RETURNING USER UI */}
                  <Typography fontWeight={600} fontSize={{ xs: 16, sm: 18 }}>
                    Welcome back, {sessionStorage.getItem("userName")}!
                  </Typography>

                  <Typography
                    fontSize={{ xs: 13, sm: 14 }}
                    sx={{ opacity: 0.9 }}
                  >
                    Your last login was on {formatDate(lastLogin)}
                  </Typography>
                </>
              ) : (
                <>
                  {/* ✅ FIRST LOGIN UI */}
                  <Typography fontWeight={600} fontSize={{ xs: 16, sm: 18 }}>
                    Welcome to the eTutoring System!
                  </Typography>

                  <Typography
                    fontSize={{ xs: 13, sm: 14 }}
                    sx={{ opacity: 0.9 }}
                  >
                    This is your first login. Explore the system anytime.
                  </Typography>
                </>
              )}
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
          value={stats.upcomingMeetings}
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
          value={stats.unreadMessages}
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
          value={stats.documentsShared}
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
          value={stats.meetingHours}
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
            <Avatar sx={{ width: 72, height: 72, fontSize: 28 }}>
              {tutorData?.tutor?.name?.charAt(0) || "?"}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={700}>
                {tutorLoading
                  ? "Loading..."
                  : tutorData?.hasTutor
                    ? tutorData.tutor.name
                    : "No Tutor Assigned"}
              </Typography>

              <Typography color="text.secondary">
                {tutorLoading
                  ? ""
                  : tutorData?.hasTutor
                    ? tutorData.tutor.email
                    : ""}
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
              disabled={!tutorData?.hasTutor}
              startIcon={<ChatBubbleOutlineOutlinedIcon />}
              sx={{
                borderRadius: 0.5,
                py: 1.4,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Send Message
            </Button>

            <Button
              variant="outlined"
              onClick={goToMeeting}
              disabled={!tutorData?.hasTutor}
              startIcon={<CalendarTodayOutlinedIcon />}
              sx={{
                borderRadius: 0.5,
                py: 1.4,
                width: { xs: "100%", sm: "auto" },
              }}
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
        alignItems="stretch"
      >
        <Box display="flex" flexDirection="column" height="100%">
          {upcomingMeetings.length === 0 ? (
            <Card
              variant="outlined"
              sx={{
                flex: 1,
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography color="text.secondary">
                  No upcoming meetings
                </Typography>
              </CardContent>
            </Card>
          ) : (
            upcomingMeetings.map((meeting) => (
              <Card
                key={meeting.id}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        bgcolor: "primary.active",
                        p: 1,
                        borderRadius: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      <CalendarTodayOutlinedIcon
                        fontSize="large"
                        sx={{ color: "primary.main" }}
                      />
                    </Box>

                    <Box flex={1} minWidth={0}>
                      <Typography fontWeight={600}>{meeting.title}</Typography>

                      <Typography color="text.secondary">
                        {new Date(meeting.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        ·{" "}
                        {new Date(meeting.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>

                    <Chip
                      label={
                        meeting.type === "IN_PERSON" ? "In-Person" : "Virtual"
                      }
                      sx={{ borderRadius: 0.5, flexShrink: 0 }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent sx={{ flex: 1 }}>
            {recentMessage ? (
              <Stack spacing={1} height="100%" justifyContent="space-between">
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={600}>
                      {recentMessage.senderName}
                    </Typography>

                    <Typography color="text.secondary">
                      {new Date(recentMessage.date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                        },
                      )}
                    </Typography>
                  </Stack>

                  <Typography color="text.secondary" mt={1}>
                    {recentMessage.content}
                  </Typography>
                </Box>

                {!recentMessage.isRead && (
                  <Chip
                    label="New"
                    size="small"
                    color="primary"
                    sx={{ width: "fit-content", borderRadius: 0.5 }}
                  />
                )}
              </Stack>
            ) : (
              <Box
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="text.secondary">
                  No recent messages
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
        mt={2}
      >
        <MeetingStatisticsChart data={meetingStats} />
        <ActivityTrendsChart data={activityData} />
      </Box>
    </Box>
  );
};

export default Dashboard;
