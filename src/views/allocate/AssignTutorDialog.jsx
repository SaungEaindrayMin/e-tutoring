import {
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";
import SearchIcon from "@mui/icons-material/Search";

import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const AssignTutorDialog = ({ open, onClose, selectedStudents, onAssigned }) => {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const config = new Configuration();
  const dataService = new DataServices();

  const fetchTutors = async () => {
    setLoading(true);

    try {
      const serviceAction = `${config.SERVICE_TUTOR_LIST}?role=TUTOR`;

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success") {
        setTutors(res.data || []);
      } else {
        setTutors([]);
      }
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTutor = async () => {
    if (!selectedTutor || selectedStudents.length === 0) return;

    setAssignLoading(true);

    try {
      const body = {
        studentIds: selectedStudents,
        tutorId: selectedTutor,
      };

      const res = await dataService.retrievePOST(
        body,
        config.SERVICE_NAME + config.SERVICE_ASSIGN_TUTOR,
      );

      if (res?.status === "success") {
        onAssigned?.();
        onClose();
      }
    } catch (error) {
      console.error("Assign tutor failed:", error);
    } finally {
      setAssignLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTutors();
    }
  }, [open]);

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      title="Allocate Personal Tutor"
      titleAlign="start"
      actions={
        <Button
          variant="contained"
          onClick={handleAssignTutor}
          disabled={!selectedTutor || selectedStudents.length === 0}
          sx={{ px: { xs: 3, sm: 5 }, width: { xs: "100%", sm: "auto" } }}
        >
          {assignLoading ? <CircularProgress size={20} /> : "Assign"}
        </Button>
      }
    >
      <Typography sx={{ mb: 1, color: "text.muted" }}>
        Select tutor to assign
      </Typography>

      <InputField
        icon={SearchIcon}
        size="small"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

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
        <Table sx={{ minWidth: { xs: 280, sm: 400 } }}>
          <TableHead>
            <TableRow>
              <TableCell>Tutor name</TableCell>
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
                <TableCell colSpan={2} align="center">
                  <CircularProgress size={22} />
                </TableCell>
              </TableRow>
            ) : filteredTutors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No tutors found
                </TableCell>
              </TableRow>
            ) : (
              filteredTutors.map((tutor) => (
                <TableRow
                  key={tutor.tutorProfile?.id}
                  hover
                  onClick={() => setSelectedTutor(tutor.tutorProfile?.id)}
                  sx={{
                    cursor: "pointer",
                    bgcolor:
                      selectedTutor === tutor.tutorProfile?.id
                        ? "action.selected"
                        : "inherit",
                  }}
                >
                  <TableCell>{tutor.name}</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {tutor.email}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomDialog>
  );
};

export default AssignTutorDialog;
