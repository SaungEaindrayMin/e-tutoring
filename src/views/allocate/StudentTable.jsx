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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputField from "../../layouts/main/components/InputFields";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const StudentTable = ({
  selectedStudents,
  setSelectedStudents,
  refreshKey,
  setStudentsData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
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
      if (searchValue) params.append("search", searchValue);

      const serviceAction = `${config.SERVICE_USERS}?${params.toString()}`;
      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success" && Array.isArray(res.data)) {
        setStudents(res.data);
        setTotalPages(res?.pagination?.totalPages || 1);
        if (setStudentsData) setStudentsData(res.data);
      } else {
        setStudents([]);
        setTotalPages(1);
        if (setStudentsData) setStudentsData([]);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]);
      setTotalPages(1);
      if (setStudentsData) setStudentsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, search);
  }, [page, search, refreshKey]);

  const filteredStudents = students.filter((student) => {
    const assigned = !!student.studentProfile?.tutorId;
    if (filter === "assigned") return assigned;
    if (filter === "unassigned") return !assigned;
    return true;
  });

  const allSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) =>
      selectedStudents.includes(s.studentProfile?.id),
    );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = filteredStudents
        .map((s) => s.studentProfile?.id)
        .filter(Boolean);
      setSelectedStudents(allIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((item) => item !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };
  return (
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

      <Typography variant="body2" color="text.secondary" mb={3}>
        Select students and assign them to personal tutors (up to 10 at a time)
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

        <Box flex={{ xs: 1, sm: 1 }}>
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

      {/* Mobile: card list */}
      {isMobile ? (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredStudents.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={3}
            >
              No students found
            </Typography>
          ) : (
            filteredStudents.map((student) => {
              const tutorName = student.studentProfile?.tutor?.name;
              const assigned = !!student.studentProfile?.tutorId;
              const studentProfileId = student.studentProfile?.id;
              const isChecked = selectedStudents.includes(studentProfileId);

              return (
                <Box
                  key={studentProfileId}
                  sx={{
                    border: 0.5,
                    borderColor: isChecked ? "primary.main" : "text.input",
                    borderRadius: 1,
                    p: 1.5,
                    bgcolor: isChecked ? "primary.active" : "background.paper",
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelect(studentProfileId)}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleSelect(studentProfileId)}
                    size="small"
                    sx={{ p: 0, mt: 0.25 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Box flex={1} display="flex" flexDirection="column" gap={0.5}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={600} fontSize={13}>
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
                    </Box>
                    <Typography
                      fontSize={12}
                      color="text.secondary"
                      noWrap
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {student.email}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <Typography fontSize={12} color="text.secondary">
                        Tutor:
                      </Typography>
                      <Typography fontSize={12} fontWeight={500}>
                        {tutorName || "Not assigned"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      ) : (
        /* Tablet & Desktop: scrollable table */
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selectedStudents.length > 0 && !allSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Student name</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  University email
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Current tutor
                </TableCell>
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
                  const tutorName = student.studentProfile?.tutor?.name;
                  const assigned = !!student.studentProfile?.tutorId;
                  const studentProfileId = student.studentProfile?.id;

                  return (
                    <TableRow key={studentProfileId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedStudents.includes(studentProfileId)}
                          onChange={() => handleSelect(studentProfileId)}
                        />
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", sm: "table-cell" },
                          maxWidth: { sm: 160, md: "unset" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {student.email}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          color: assigned ? "text.primary" : "text.secondary",
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
      )}

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
    </Card>
  );
};

export default StudentTable;
