import { useState } from "react";
import { Box, Button, Typography, Dialog } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PageHeader from "../../layouts/main/components/PageHeader";
import TabSwitcher from "./TabSwitcher";
import MeetingCard from "./MeetingCard";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import ScheduleMeetingForm from "./ScheduleMeetingForm";
import SelectStudentsStep from "./SelectStudentsStep";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Meeting = ({ role = "tutor" }) => {
  const isTutor = role === "tutor";
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);

  const upcomingMeetings = [
    {
      title: "Academic Progress Review",
      date: "Feb 9, 2026",
      time: "10:00 AM - 12:00 AM",
      link: "Join Virtual Meeting",
      location: "Building 12",
      student: "Alice",
      note: "Please Come exact time!!",
      type: "In Person",
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    link: "",
    location: "",
    notes: "",
    platform: "",
    selectedStudents: [],
  });
  const [errors, setErrors] = useState({});

  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setFormData({ title: "", type: "", date: "", startTime: "", endTime: "", link: "", location: "", notes: "", platform: "", selectedStudents: [] });
    setErrors({});
  };

  const handleEdit = (mtg) => {
    setOpen(true);
    setStep(1);
    setErrors({});

    let typeVal = mtg.type === "In Person" ? "Physical" : "Virtual";
    let dayExtracted = mtg.date ? mtg.date.split(" ")[1].replace(",", "") : "";

    setFormData({
      title: mtg.title || "",
      type: typeVal,
      date: dayExtracted,
      startTime: "10:00", // Using 24-hr html time standards
      endTime: "12:00",
      link: mtg.link || "",
      location: mtg.location || "",
      notes: mtg.note || "",
      platform: "Zoom",
      selectedStudents: []
    });
  };

  const handleNext = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Please fill meeting title!";
    if (!formData.type) newErrors.type = "Please fill meeting type!";
    if (!formData.startTime) newErrors.startTime = "Please fill start time!";
    if (!formData.endTime) newErrors.endTime = "Please fill end time!";

    if (formData.type === "Virtual") {
      if (!formData.link) newErrors.link = "Please fill meeting link!";
      if (!formData.platform) newErrors.platform = "Please fill platform!";
    } else if (formData.type === "Physical") {
      if (!formData.location) newErrors.location = "Please fill location!";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isTutor) {
        setStep(2);
      } else {
        handleSchedule();
      }
    }
  };

  const handleSchedule = () => {
    // Simulated API submission success
    setOpen(false);
    setSuccessOpen(true);
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setFormData({ title: "", type: "", date: "", startTime: "", endTime: "", link: "", location: "", notes: "", platform: "", selectedStudents: [] });
    setStep(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Meetings"
        subtitle="Schedule and manage your tutoring meetings"
        buttonText="Schedule Meeting"
        onButtonClick={handleOpen}
      />

      <TabSwitcher value={tab} onChange={setTab} />

      {tab === "upcoming" && upcomingMeetings.length === 0 ? (
        <Box
          sx={{
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: "4px",
            p: 3,
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            bgcolor: "background.paper",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "12px",
              bgcolor: "primary.active",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "primary.light"
            }}
          >
            <CalendarTodayOutlinedIcon sx={{ color: "primary.main", fontSize: 32 }} />
          </Box>

          <Typography variant="body2" fontWeight={500} color="text.secondary" mb={2}>
            No upcoming meetings
          </Typography>

          <Button
            variant="outlined"
            onClick={handleOpen}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: 600,
              color: "text.primary",
              borderColor: "text.input",
              px: 3,
              py: 1,
              ":hover": {
                borderColor: "text.secondary",
                bgcolor: "background.switch"
              }
            }}
          >
            Schedule Your First Meeting
          </Button>
        </Box>
      ) : tab === "upcoming" && upcomingMeetings.length > 0 ? (
        upcomingMeetings.map((mtg, i) => (
          <MeetingCard
            key={i}
            isUpcoming={true}
            {...mtg}
            onEdit={() => handleEdit(mtg)}
          />
        ))
      ) : null}

      {tab === "past" && (
        <MeetingCard
          title="Academic Progress Review"
          date="Feb 9, 2026"
          time="10:00 AM - 12:00 AM"
          link="Join Virtual Meeting (Zoom)"
          tutor="Dr . Sarah Brown"
          status="Completed"
          type="Virtual"
        />
      )}

      <CustomDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule New Meeting"
        subtitle="Fill in the details to schedule a new meeting"
        maxWidth="md"
        actions={
          step === 1 ? (
            <Box display="flex" justifyContent="flex-end" width="100%" px={1} py={1}>
              <Button
                variant="contained"
                onClick={handleNext}
                startIcon={!isTutor ? <AddIcon /> : undefined}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  px: isTutor ? 5 : 3,
                  py: 1,
                  boxShadow: "none",
                }}
              >
                {isTutor ? "Next" : "Schedule Meeting"}
              </Button>
            </Box>
          ) : (
            <Box display="flex" justifyContent="flex-end" gap={2} width="100%" px={1} py={1}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => setStep(1)}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: "none",
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleSchedule}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: "none",
                }}
              >
                Schedule Meeting
              </Button>
            </Box>
          )
        }
      >
        {step === 1 ? (
          <ScheduleMeetingForm formData={formData} setFormData={setFormData} errors={errors} />
        ) : (
          <SelectStudentsStep formData={formData} setFormData={setFormData} />
        )}
      </CustomDialog>

      <Dialog
        open={successOpen}
        onClose={handleCloseSuccess}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
            p: 4,
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={4} mt={2}>
          <CheckCircleOutlineIcon sx={{ fontSize: 24, color: "text.primary" }} />
          <Typography variant="h6" fontWeight={700}>
            Meeting scheduled successfully
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: 600,
              px: 4,
              py: 1,
              boxShadow: "none",
            }}
          >
            OK
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Meeting;
