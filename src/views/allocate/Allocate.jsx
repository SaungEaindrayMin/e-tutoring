import { Box, Card, Button, Typography } from "@mui/material";
import { useState } from "react";
import PageHeader from "../../layouts/main/components/PageHeader";
import SummaryCards from "./SummaryCards";
import StudentTable from "./StudentTable";
import AssignTutorDialog from "./AssignTutorDialog";
import { PersonAddAlt1Outlined } from "@mui/icons-material";

const Allocate = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAssignClick = () => {
    if (selectedStudents.length > 0) {
      setOpenDialog(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  return (
    <Box>
      <PageHeader
        title="Allocate Personal Tutor"
        subtitle="Assign or reassign personal tutors to students"
      />

      <SummaryCards />

      {selectedStudents.length > 0 && (
        <Card
          sx={{
            p: 2,
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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

          <Box>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={handleAssignClick}
            >
              Assign selected
            </Button>

            <Button
              sx={{
                bgcolor: "background.paper",
                border: 0.5,
                borderColor: "text.input",
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
      />

      <AssignTutorDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
};

export default Allocate;
