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
import { Search as SearchIcon } from "@mui/icons-material";
import PageHeader from "../../../layouts/main/components/PageHeader";
import StatsCard from "../../../layouts/main/components/StatsCard";
import { Person2Outlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import InputField from "../../../layouts/main/components/InputFields";
import Configuration from "../../../services/configuration";
import DataServices from "../../../services/data-services";
import MeetingStatisticsChart from "./MeetingStatisticsChart";
import ActivityTrendsChart from "./ActivityTrendsChart";

const TutorDashboard = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [data, setData] = useState({
    totalStudents: 0,
    upcomingMeeting: 0,
    unreadMessages: 0,
    totalDocuments: 0,
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

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
    fetchStudents(page, search);
  }, [page, search]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setData({
        totalStudents: 15,
        upcomingMeeting: 20,
        unreadMessages: 10,
        totalDocuments: 20,
      });
      setLoading(false);
    }, 800);
  }, []);

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
            borderRadius: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #5B9BD5 0%, #0F6CBD 100%)",
            color: "#fff",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <CheckCircleOutlineIcon sx={{ fontSize: 32, opacity: 0.9 }} />

            <Box>
              <Typography fontWeight={600} fontSize={18}>
                Welcome to the eTutoring System!
              </Typography>

              <Typography fontSize={14} sx={{ opacity: 0.9 }}>
                This is your first login. We’re glad to have you here. Explore
                the system and don’t hesitate to reach out if you need any
                assistance.
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={() => setShowWelcome(false)}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
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
      {/* 
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
        <Typography sx={{ color: "text.warning" }}>
          1 Student Needs Tutor Assignment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use bulk allocation to quickly assign multiple students to a tutor
        </Typography>
        <Button
          variant="contained"
          sx={{ px: { xs: 3, sm: 4 }, width: { xs: "100%", sm: "25%" } }}
        >
          View Details
        </Button>
      </Box> */}

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2}
        mt={2}
      >
        <MeetingStatisticsChart />
        <ActivityTrendsChart />
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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            border: 0.5,
            borderColor: "text.input",
            borderRadius: 0.5,
            overflow: "hidden",
            boxShadow: "none",
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: { xs: 480, sm: 600 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Student name</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  University email
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
                  const studentProfileId = student.studentProfile?.id;

                  return (
                    <TableRow key={studentProfileId}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "table-cell" },
                          maxWidth: { sm: 160, md: "unset" },
                          overflowX: "auto",
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
