import {
  Box,
  Card,
  Checkbox,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  TableContainer,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputField from "../../layouts/main/components/InputFields";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const StudentTable = ({ selectedStudents, setSelectedStudents }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const config = new Configuration();
  const dataService = new DataServices();

  const handleSelect = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((item) => item !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

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

  const filteredStudents = students.filter((student) => {
    const assigned = !!student.studentProfile?.tutorId;

    if (filter === "assigned") return assigned;
    if (filter === "unassigned") return !assigned;

    return true;
  });

  return (
    <Card
      sx={{
        mt: 4,
        p: 3,
        boxShadow: "none",
        border: 0.5,
        borderColor: "text.input",
        borderRadius: 0.5,
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Student List
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Select students and assign them to personal tutors (up to 10 at a time)
      </Typography>

      <Box display="flex" gap={2} mb={3}>
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

        <Box flex={1}>
          <InputField
            select
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Students</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="unassigned">Unassigned</MenuItem>
          </InputField>
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
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>Student name</TableCell>
              <TableCell>University email</TableCell>
              <TableCell>Current tutor</TableCell>
              <TableCell>Status</TableCell>
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
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No students found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const tutorName = student.studentProfile?.tutorName;
                const assigned = !!student.studentProfile?.tutorId;

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelect(student.id)}
                      />
                    </TableCell>

                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>

                    <TableCell
                      sx={{
                        color: tutorName ? "text.primary" : "text.secondary",
                        fontWeight: tutorName ? 400 : 500,
                      }}
                    >
                      {tutorName || "Not assigned"}
                    </TableCell>

                    <TableCell>
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

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
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
    </Card>
  );
};

export default StudentTable;
