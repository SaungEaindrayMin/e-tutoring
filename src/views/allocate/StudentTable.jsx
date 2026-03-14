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
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputField from "../../layouts/main/components/InputFields";

const studentsData = [
  {
    id: 1,
    name: "Zue Zue",
    email: "zue@university.edu",
    tutor: "Dr.Sarah Brown",
    assigned: true,
  },
  {
    id: 2,
    name: "Hmue",
    email: "hmue@university.edu",
    tutor: "Dr.Sarah Brown",
    assigned: true,
  },
  {
    id: 3,
    name: "Gue Gue",
    email: "gue@university.edu",
    tutor: "Prof.Michael Chen",
    assigned: true,
  },
  {
    id: 4,
    name: "Ni Ni",
    email: "ni@university.edu",
    tutor: "Prof.Michael Chen",
    assigned: true,
  },
  {
    id: 5,
    name: "Ngu",
    email: "ngu@university.edu",
    tutor: "Dr.Sarah Brown",
    assigned: true,
  },
  {
    id: 6,
    name: "Khin",
    email: "khin@university.edu",
    tutor: null,
    assigned: false,
  },
  {
    id: 7,
    name: "Phue Phue",
    email: "phue@university.edu",
    tutor: null,
    assigned: false,
  },
  {
    id: 8,
    name: "Eaint Eaint",
    email: "eaint@university.edu",
    tutor: null,
    assigned: false,
  },
  {
    id: 9,
    name: "Aung Aung",
    email: "aung@university.edu",
    tutor: null,
    assigned: false,
  },
  {
    id: 10,
    name: "Jhon",
    email: "jhon@university.edu",
    tutor: null,
    assigned: false,
  },
];

const StudentTable = ({ selectedStudents, setSelectedStudents }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const handleSelect = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((item) => item !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "assigned"
          ? student.assigned
          : !student.assigned;

    return matchesSearch && matchesFilter;
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
            onChange={(e) => setSearch(e.target.value)}
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
                {" "}
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
            {filteredStudents.map((student) => (
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
                    color: student.tutor ? "text.primary" : "text.secondary",
                    fontWeight: student.tutor ? 400 : 500,
                  }}
                >
                  {student.tutor || "Not assigned"}
                </TableCell>
                <TableCell>
                  {student.assigned ? (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default StudentTable;
