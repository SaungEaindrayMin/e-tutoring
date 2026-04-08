import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Card,
} from "@mui/material";
import { CalendarToday, Close, Search as SearchIcon } from "@mui/icons-material";
import PageHeader from "../../../layouts/main/components/PageHeader";
import StatsCard from "../../../layouts/main/components/StatsCard";
import { Person2Outlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import InputField from "../../../layouts/main/components/InputFields";
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";
import MeetingStatisticsChart from "./MeetingStatisticsChart";
import ActivityTrendsChart from "./ActivityTrendsChart";
import { useNavigate } from "react-router-dom";

const TutorDashboard = () => {
  const navigate = useNavigate();
  const goToMeeting = () => navigate("/admin/meetings");
  const [showWelcome, setShowWelcome] = useState(true);
  const [data, setData] = useState({
    totalStudents: 0,
    upcomingMeeting: 0,
    unreadMessages: 0,
    totalDocuments: 0,
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [nextMeeting, setNextMeeting] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [lastLogin, setLastLogin] = useState(null);

  const config = new Configuration();
  const dataService = new DataServices();

  const fetchStudents = async (pageNumber = 1, searchValue = "") => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", pageNumber);
      params.append("limit", limit);
      params.append("role", "STUDENT");

      const userStr = Cookies.get(config.COOKIE_NAME_USER);
      let currentUser = null;
      try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
      const currentUserId = currentUser?.id || currentUser?.userId || null;

      let tutorId = null;
      if (currentUserId) {
        const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
        if (profileRes?.status === "success" && profileRes.data) {
          tutorId = profileRes.data.tutorProfile?.id;
        }
      }

      if (searchValue) {
        params.append("search", searchValue);
      }

      const serviceAction = `${config.SERVICE_USERS}?${params.toString()}`;

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success" && Array.isArray(res.data)) {
        // Filter students where studentProfile.tutorId matches the tutorId
        const filtered = tutorId 
          ? res.data.filter(s => s.studentProfile?.tutorId === tutorId)
          : res.data;
        setStudents(filtered);
        setTotalPages(res?.pagination?.totalPages || 1);
      } else {
        setStudents([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, search);
  }, [page, search]);

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
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        config.SERVICE_TUTOR_DASHBOARD,
      );

      if (res) {
        setData({
          totalStudents: res.cards?.totalStudents || 0,
          upcomingMeeting: res.cards?.upcomingMeetings || 0,
          unreadMessages: res.cards?.unreadMessages || 0,
          totalDocuments: res.cards?.totalDocuments || 0,
        });

        setNextMeeting(res.nextMeeting);

        setActivityData(res.activityTrends?.data || []);
        setWeeklyStats(res.weeklyStats?.data || {});
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <PageHeader
        title="Tutor Dashboard"
        subtitle="Manage your student and track their progress"
      />
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
            <CheckCircleOutlineIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />

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
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
        <StatsCard
          title="Total Students"
          value={data.totalStudents}
          icon={<Person2Outlined sx={{ color: "primary.main" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            boxShadow: "none",
            bgcolor: "background.blue",
            color: "primary.main",
          }}
        />

        <StatsCard
          title="Upcoming meeting"
          value={data.upcomingMeeting}
          icon={<Person2Outlined sx={{ color: "text.message" }} />}
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
          value={data.unreadMessages}
          icon={<Person2Outlined sx={{ color: "text.document" }} />}
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
          title="Total Documents"
          value={data.totalDocuments}
          icon={<Person2Outlined sx={{ color: "text.meeting" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            boxShadow: "none",
            bgcolor: "background.yellow",
            color: "text.meeting",
          }}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          border: 0.5,
          borderColor: "text.input",
          borderRadius: 0.5,
          boxShadow: "none",
          mt: 5,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <CalendarToday sx={{ color: "text.secondary" }} />
          <Typography>Next Meeting</Typography>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            {nextMeeting
              ? `${nextMeeting.title} • ${new Date(nextMeeting.date).toLocaleDateString()}`
              : "No upcoming meeting"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="sm"
            useGradient
            onClick={goToMeeting}
          >
            View Details
          </Button>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
        mt={2}
      >
        <MeetingStatisticsChart />
        <ActivityTrendsChart data={activityData} />
      </Box>

      <Card
        sx={{
          mt: 4,
          p: { xs: 2, sm: 3 },
          boxShadow: "none",
          border: 0.5,
          borderColor: "text.input",
          borderRadius: 0.5,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Student List
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mb={3}
        >
          <Box flex={3}>
            <InputField
              placeholder="Search..."
              size="small"
              icon={SearchIcon}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
            />
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            borderRadius: 1,
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>

                {/* Hide on mobile */}
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  University Email
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                "& .MuiTableCell-root": { borderBottom: "none" },
              }}
            >
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => {
                  const studentProfileId = student.studentProfile?.id;

                  return (
                    <TableRow key={studentProfileId}>
                      <TableCell>
                        <Typography fontWeight={500}>{student.name}</Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: { xs: "block", sm: "none" },
                            wordBreak: "break-all",
                          }}
                        >
                          {student.email}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "table-cell" },
                          maxWidth: { sm: 160, md: 300 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {student.email}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              border: "1px solid",
              borderColor: "text.input",
              borderRadius: 0.5,
              p: 0.5,
            },
            "& .Mui-selected": {
              bgcolor: "primary.active",
              color: "primary.main",
              borderColor: "primary.main",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TutorDashboard;
