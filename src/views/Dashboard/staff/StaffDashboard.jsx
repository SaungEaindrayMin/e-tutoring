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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  ErrorOutline,
  PeopleAltOutlined,
  PersonAddAlt,
  PersonRemoveAlt1Outlined,
  Search as SearchIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import IconButton from "@mui/material/IconButton";
import PageHeader from "../../../layouts/main/components/PageHeader";
import StatsCard from "../../../layouts/main/components/StatsCard";
import { useEffect, useState } from "react";
import InputField from "../../../layouts/main/components/InputFields";
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";
import MeetingStatisticsChart from "./MeetingStatisticsChart";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const goToAllocate = () => navigate("/admin/allocate-tutor");
  const [showWelcome, setShowWelcome] = useState(true);
  const [lastLogin, setLastLogin] = useState(null);
  const [data, setData] = useState({
    totalStudents: 0,
    totalTutors: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [weeklyStats, setWeeklyStats] = useState({
    labels: [],
    scheduled: [],
    completed: [],
  });
  const config = new Configuration();
  const dataService = new DataServices();

  const fetchStudents = async (pageNumber = 1, searchValue = "") => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", pageNumber);
      params.append("limit", limit);
      params.append("role", "STUDENT");

      if (searchValue) {
        params.append("search", searchValue);
      }

      const serviceAction = `${config.SERVICE_USERS}?${params.toString()}`;

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success" && Array.isArray(res.data)) {
        setStudents(res.data);
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
    console.log("SEARCH CHANGED:", search);
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
    const fetchDashboardStats = async () => {
      setLoading(true);

      try {
        const res = await dataService.retrieve(
          config.SERVICE_NAME,
          config.SERVICE_ADMIN_DASHBOARD,
        );

        if (res?.success === "success") {
          setData({
            totalStudents: res.stats?.totalStudents || 0,
            totalTutors: res.stats?.totalTutors || 0,
            assignedStudents: res.stats?.assignedStudents || 0,
            unassignedStudents: res.stats?.unassignedStudents || 0,
          });

          if (res.weeklyStats) {
            const labels = [];
            const scheduled = [];
            const completed = [];

            for (let i = 1; i <= 6; i++) {
              const weekKey = `week${i}`;
              const weekData = res.weeklyStats[weekKey];

              labels.push(`Week ${i}`);

              scheduled.push(weekData?.[0] ?? 0);
              completed.push(weekData?.[1] ?? 0);
            }

            setWeeklyStats({
              labels,
              scheduled,
              completed,
            });
          }
        }
      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <Box p={{ xs: 1.5, sm: 2 }}>
      <PageHeader
        title="Staff Dashboard"
        subtitle="System overview and management"
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
          md: "1fr 1fr 1fr 1fr",
        }}
        gap={2}
      >
        <StatsCard
          title="Total Students"
          value={data.totalStudents}
          icon={<PeopleAltOutlined sx={{ color: "primary.main" }} />}
          loading={loading}
          sx={{
            border: 0.5,
            boxShadow: "none",
            bgcolor: "background.blue",
            color: "primary.main",
          }}
        />

        <StatsCard
          title="Total Tutors"
          value={data.totalTutors}
          icon={<PeopleAltOutlined sx={{ color: "text.message" }} />}
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
          title="Assigned Students"
          value={data.assignedStudents}
          icon={<PersonAddAlt sx={{ color: "text.document" }} />}
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
          title="Unassigned Students"
          value={data.unassignedStudents}
          icon={<PersonRemoveAlt1Outlined sx={{ color: "text.danger" }} />}
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

      <Box
        sx={{
          p: 2,
          border: 0.5,
          borderColor: "text.input",
          borderRadius: 0.5,
          boxShadow: "none",
          mt: { xs: 3, sm: 5 },
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography sx={{ color: "text.warning", display: "flex" }}>
          <ErrorOutline />
          <Typography>
            {data.unassignedStudents} Students Needs Tutor Assignment
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use bulk allocation to quickly assign multiple students to a tutor
        </Typography>
        <Button
          variant="contained"
          color="primary"
          useGradient
          onClick={goToAllocate}
          sx={{ px: { xs: 0.5, sm: 1 }, width: { xs: "100%", sm: "25%" } }}
          startIcon={<PersonAddAlt />}
        >
          Bulk Allocate Students
        </Button>
      </Box>

      <Box
        mt={3}
      >
        <MeetingStatisticsChart weeklyStats={weeklyStats} />
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
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Tutor Allocation
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mb={3}
        >
          <Box flex={1}>
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

        {isMobile ? (
          <Box display="flex" flexDirection="column" gap={1.5}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={24} />
              </Box>
            ) : students.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={3}
              >
                No students found
              </Typography>
            ) : (
              students.map((student) => {
                const tutorName = student.studentProfile?.tutor?.name;
                const tutorEmail = student.studentProfile?.tutor?.email;
                const assigned = !!student.studentProfile?.tutorId;
                const studentProfileId = student.studentProfile?.id;

                return (
                  <Box
                    key={studentProfileId}
                    sx={{
                      border: 0.5,
                      borderColor: "text.input",
                      borderRadius: 1,
                      p: 1.5,
                      bgcolor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.75,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={600}
                        fontSize={13}
                        noWrap
                        sx={{ flex: 1, mr: 1 }}
                      >
                        {student.name}
                      </Typography>
                      {assigned ? (
                        <Chip
                          label="Assigned"
                          size="small"
                          sx={{
                            px: 1,
                            color: "text.assign",
                            bgcolor: "icon.assign",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Chip
                          label="Unassigned"
                          color="error"
                          size="small"
                          sx={{ px: 1, flexShrink: 0 }}
                        />
                      )}
                    </Box>
                    <Typography
                      fontSize={12}
                      color="text.secondary"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {student.email}
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      <Typography fontSize={12} color="text.secondary">
                        Tutor:
                      </Typography>
                      <Typography fontSize={12} fontWeight={500} noWrap>
                        {tutorName || "Not assigned"}
                      </Typography>
                    </Box>
                    {tutorEmail && (
                      <Typography
                        fontSize={12}
                        color="text.secondary"
                        noWrap
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {tutorEmail}
                      </Typography>
                    )}
                  </Box>
                );
              })
            )}
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              border: 0.5,
              borderColor: "text.input",
              borderRadius: 1,
              boxShadow: "none",
              width: "100%",
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: 12, sm: 14 },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Student name
                  </TableCell>
                  <TableCell
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: 12, sm: 14 },
                      whiteSpace: "nowrap",
                    }}
                  >
                    University email
                  </TableCell>
                  <TableCell
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: 12, sm: 14 },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Current tutor
                  </TableCell>
                  <TableCell
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: 12, sm: 14 },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tutor email
                  </TableCell>
                  <TableCell
                    sx={{
                      px: { xs: 1, sm: 2 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: 12, sm: 14 },
                      whiteSpace: "nowrap",
                    }}
                  >
                    Status
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
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No students found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => {
                    const tutorName = student.studentProfile?.tutor?.name;
                    const tutorEmail = student.studentProfile?.tutor?.email;
                    const assigned = !!student.studentProfile?.tutorId;
                    const studentProfileId = student.studentProfile?.id;

                    return (
                      <TableRow key={studentProfileId}>
                        <TableCell
                          sx={{
                            px: { xs: 1, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: 12, sm: 14 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {student.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {student.email}
                        </TableCell>
                        <TableCell
                          sx={{
                            px: { xs: 1, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: 12, sm: 14 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tutorName || "Not assigned"}
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tutorEmail || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            px: { xs: 1, sm: 2 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: 12, sm: 14 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {assigned ? (
                            <Chip
                              label="Assigned"
                              size="small"
                              sx={{
                                px: 1,
                                color: "text.assign",
                                bgcolor: "icon.assign",
                              }}
                            />
                          ) : (
                            <Chip
                              label="Unassigned"
                              color="error"
                              size="small"
                              sx={{ px: 1 }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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

export default StaffDashboard;
