import { Box, Card, Button, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "../../layouts/main/components/PageHeader";
import SummaryCards from "./SummaryCards";
import StudentTable from "./StudentTable";
import AssignTutorDialog from "./AssignTutorDialog";
import { PersonAddAlt1Outlined } from "@mui/icons-material";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const Allocate = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const config = new Configuration();
  const dataService = new DataServices();

  const allSelectedAssigned =
    selectedStudents.length > 0 &&
    selectedStudents.every((id) => {
      const student = students.find((s) => s.studentProfile?.id === id);
      return !!student?.studentProfile?.tutorId;
    });

  const handleAssignClick = () => {
    if (selectedStudents.length > 0) {
      setOpenDialog(true);
    }
  };

  const handleUnassignClick = async () => {
    try {
      console.log("Unassign clicked, students:", selectedStudents);

      const promises = selectedStudents.map((studentId) =>
        dataService.retrievePOST(
          { studentId },
          config.SERVICE_NAME + config.SERVICE_UNASSIGN_TUTOR,
        ),
      );

      const responses = await Promise.all(promises);

      console.log("API responses:", responses);

      toast.success("Student(s) unassigned successfully");

      setSelectedStudents([]);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Unassign error:", error);
      toast.error("Failed to unassign student(s)");
    }
  };

  const handleClearSelection = () => setSelectedStudents([]);

  return (
    <Box>
      <PageHeader
        title="Allocate Personal Tutor"
        subtitle="Assign or reassign personal tutors to students"
      />

      <SummaryCards refreshKey={refreshKey} />

      {selectedStudents.length > 0 && (
        <Card
          sx={{
            p: 2,
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
            bgcolor: "primary.active",
            color: "text.secondary",
            borderRadius: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PersonAddAlt1Outlined />
            <Typography>
              {selectedStudents.length} Student(s) selected
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              useGradient
              sx={{ width: { xs: "100%", sm: "auto" } }}
              onClick={
                selectedStudents.some(
                  (id) =>
                    students.find((s) => s.studentProfile?.id === id)
                      ?.studentProfile?.tutorId,
                )
                  ? handleUnassignClick
                  : handleAssignClick
              }
            >
              {selectedStudents.some(
                (id) =>
                  students.find((s) => s.studentProfile?.id === id)
                    ?.studentProfile?.tutorId,
              )
                ? "Unassign selected"
                : "Assign selected"}
            </Button>

            <Button
              sx={{
                bgcolor: "background.paper",
                border: 0.5,
                borderColor: "text.input",
                width: { xs: "100%", sm: "auto" },
              }}
              onClick={handleClearSelection}
            >
              Clear Selection
            </Button>
          </Box>
        </Card>
      )}

      <StudentTable
        selectedStudents={selectedStudents}
        setSelectedStudents={setSelectedStudents}
        refreshKey={refreshKey}
        setStudentsData={setStudents}
      />

      <AssignTutorDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedStudents={selectedStudents}
        onAssigned={() => {
          setSelectedStudents([]);
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </Box>
  );
};

export default Allocate;
