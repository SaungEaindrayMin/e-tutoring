import { useState, useEffect } from "react";
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
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import Cookies from "js-cookie";

const dataService = new DataServices();
const config = new Configuration();

const Meeting = ({ role }) => {
  const sessionRole = typeof window !== "undefined" ? sessionStorage.getItem("userRole") : null;
  const isTutor = sessionRole ? sessionRole !== "STUDENT" : role !== "student";
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [counts, setCounts] = useState({ upcoming: 0, past: 0 });

  const getSchedules = async () => {
    const endpoint = "/v1/schedule";
    const queryParams = "?page=1&limit=10";
    const response = await dataService.retrieve(endpoint, queryParams);

    if (response && response.status === "success") {
      setSchedules(response.data || []);
      if (response.meta) {
        setCounts({
          upcoming: response.meta.pendingCount || 0,
          past: response.meta.completedCount || 0,
        });
      }
    } else {
      console.error("Failed to load schedules", response);
      setSchedules([]);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  const formatMeetingData = (mtg) => {
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    const d = new Date(mtg.date);
    const formattedDate = isNaN(d) ? mtg.date : d.toLocaleDateString('en-US', optionsDate);

    const formatTimeStr = (timeStr) => {
      if (!timeStr) return "";
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) {
        let [hours, minutes] = timeStr.split(':');
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
      }
      const dateObj = new Date(timeStr);
      if (isNaN(dateObj)) return timeStr;
      return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
    };

    const formattedTime = (!mtg.startTime || !mtg.endTime) 
      ? "" 
      : `${formatTimeStr(mtg.startTime)} - ${formatTimeStr(mtg.endTime)}`;

    let typeDisplay = mtg.type;
    if (mtg.type === "VIRTUAL") typeDisplay = "Virtual";
    if (mtg.type === "IN_PERSON") typeDisplay = "Physical";

    return {
      title: mtg.title,
      date: formattedDate,
      time: formattedTime,
      link: mtg.link,
      location: mtg.location,
      type: typeDisplay,
      student: mtg.student?.user?.name,
      tutor: mtg.tutor?.user?.name,
      note: mtg.note,
      status: mtg.isCompleted ? "Completed" : null,
    };
  };

  const upcomingSchedules = schedules.filter(s => !s.isCompleted);
  const pastSchedules = schedules.filter(s => s.isCompleted);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
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
    setFormData({ id: null, title: "", type: "", date: "", startTime: "", endTime: "", link: "", location: "", notes: "", platform: "", selectedStudents: [] });
    setErrors({});
  };

  const handleEdit = (mtg) => {
    setOpen(true);
    setStep(1);
    setErrors({});

    let typeVal = mtg.type === "IN_PERSON" ? "Physical" : "Virtual";

    // Extract time from raw "1970-01-01T09:00:00.000Z" (UTC representation)
    const extractTime = (timeStr) => {
      if (!timeStr) return "";
      const d = new Date(timeStr);
      return isNaN(d) ? "" : `${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}`;
    };

    setFormData({
      id: mtg.id || null,
      title: mtg.title || "",
      type: typeVal,
      date: mtg.date || "",
      startTime: extractTime(mtg.startTime),
      endTime: extractTime(mtg.endTime),
      link: mtg.link || "",
      location: mtg.location || "",
      notes: mtg.note || "",
      platform: mtg.linkType === "ZOOM" ? "Zoom" : mtg.linkType === "MEET" ? "Google Meet" : mtg.linkType === "TEAMS" ? "Teams" : "",
      selectedStudents: []
    });
  };

  const handleNext = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Please fill meeting title!";
    if (!formData.type) newErrors.type = "Please fill meeting type!";
    if (!formData.date) newErrors.date = "Please fill date!";
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

  const handleSchedule = async () => {
    try {
      const d = new Date(formData.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const userStr = Cookies.get(config.COOKIE_NAME_USER);
      let currentUser = null;
      try { currentUser = userStr ? JSON.parse(userStr) : null; } catch(e) {}
      const currentUserId = currentUser?.id || currentUser?.userId || null;

      const extractId = (obj, roleKey) => {
        if (!obj) return null;
        if (obj[`${roleKey}Profile`]?.id) return obj[`${roleKey}Profile`].id;
        if (obj[roleKey]?.id) return obj[roleKey].id;
        if (obj[`${roleKey}Id`]) return obj[`${roleKey}Id`];
        return obj.id || obj; // Fallback to base id
      };

      let studentId = isTutor 
        ? (formData.selectedStudents.length > 0 ? extractId(formData.selectedStudents[0], 'student') : null)
        : extractId(currentUser, 'student');
        
      let tutorId = isTutor
        ? extractId(currentUser, 'tutor')
        : (formData.selectedStudents.length > 0 ? extractId(formData.selectedStudents[0], 'tutor') : null); 

      let fetchedProfile = null;
      // If the payload fell back to the root User ID because the Auth cookie lacks relation mapping, fetch the full user cleanly!
      if (studentId === currentUserId || tutorId === currentUserId) {
        try {
          const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
          if (profileRes?.status === "success" && profileRes.data) {
            fetchedProfile = profileRes.data;
            if (!isTutor) studentId = extractId(fetchedProfile, 'student');
            if (isTutor) tutorId = extractId(fetchedProfile, 'tutor');
          }
        } catch (e) {
          console.warn("Failed to fetch current user profile bindings:", e);
        }
      }

      // IF the student is scheduling and skips the selection, automatically fetch their assigned tutor.
      if (!isTutor && !tutorId) {
        // First try to see if the student naturally has a tutorId referenced in their loaded profile
        const activeProfile = fetchedProfile || currentUser;
        if (activeProfile?.studentProfile?.tutorId) {
          tutorId = activeProfile.studentProfile.tutorId;
        } else {
          const lookupResponse = await dataService.retrieve(config.SERVICE_NAME, config.SERVICE_TUTOR_LIST);
          if (lookupResponse?.status === "success" && Array.isArray(lookupResponse.data) && lookupResponse.data.length > 0) {
            tutorId = extractId(lookupResponse.data[0], 'tutor');
          } else if (lookupResponse?.data?.results && lookupResponse.data.results.length > 0) {
            tutorId = extractId(lookupResponse.data.results[0], 'tutor');
          }
        }
      }

      let linkTypeVal = null;
      if (formData.type === "Virtual") {
        if (formData.platform === "Zoom") linkTypeVal = "ZOOM";
        else if (formData.platform === "Google Meet") linkTypeVal = "MEET";
        else if (formData.platform === "Teams") linkTypeVal = "TEAMS";
      }

      const payload = {
        title: formData.title,
        type: formData.type === "Virtual" ? "VIRTUAL" : "IN_PERSON",
        date: formattedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        link: formData.link || null,
        linkType: linkTypeVal,
        location: formData.location || null,
        note: formData.notes,
        isCompleted: false
      };

      let response;
      if (formData.id) {
        response = await dataService.retrievePUT(payload, `/v1/schedule/${formData.id}`);
      } else {
        payload.studentId = studentId;
        payload.tutorId = tutorId;
        response = await dataService.retrievePOST(payload, "/v1/schedule");
      }

      if (response && response.status === "success") {
        setOpen(false);
        setSuccessOpen(true);
      } else {
        console.error("API Error Response:", response);
        alert(`Failed: ${response?.message || "Unknown error occurred"}`);
      }
    } catch (err) {
      console.error("Error scheduling meeting:", err);
      alert("Error scheduling meeting! Check console.");
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setFormData({ id: null, title: "", type: "", date: "", startTime: "", endTime: "", link: "", location: "", notes: "", platform: "", selectedStudents: [] });
    setStep(1);
    getSchedules();
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Meetings"
        subtitle="Schedule and manage your tutoring meetings"
        buttonText="Schedule Meeting"
        onButtonClick={handleOpen}
      />

      <TabSwitcher 
        value={tab} 
        onChange={setTab} 
        upcomingCount={counts.upcoming} 
        pastCount={counts.past} 
      />

      {tab === "upcoming" && upcomingSchedules.length === 0 ? (
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
      ) : tab === "upcoming" && upcomingSchedules.length > 0 ? (
        upcomingSchedules.map((mtg, i) => (
          <MeetingCard
            key={mtg.id || i}
            isUpcoming={true}
            {...formatMeetingData(mtg)}
            onEdit={() => handleEdit(mtg)}
            onDelete={async () => {
              const res = await dataService.retrieveDELETE("/v1/schedule/", mtg.id);
              // A successful DELETE usually returns an empty object {} on 204 No Content or `{ status: "success" }`
              if (res && (res.status === "success" || Object.keys(res).length === 0)) {
                await getSchedules();
              } else {
                console.error("Failed to delete schedule", res);
              }
            }}
            onComplete={async () => {
              const extractT = (t) => {
                if (!t) return "";
                const d = new Date(t);
                return isNaN(d) ? t : `${String(d.getUTCHours()).padStart(2,"0")}:${String(d.getUTCMinutes()).padStart(2,"0")}`;
              };
              const payload = {
                title: mtg.title,
                type: mtg.type,
                date: mtg.date ? mtg.date.split("T")[0] : null,
                startTime: extractT(mtg.startTime),
                endTime: extractT(mtg.endTime),
                link: mtg.link || null,
                linkType: mtg.linkType || null,
                location: mtg.location || null,
                note: mtg.note || "",
                isCompleted: true
              };
              const res = await dataService.retrievePUT(payload, `/v1/schedule/${mtg.id}`);
              if (res && res.status === "success") {
                return true;
              }
              console.error("Failed to complete schedule", res);
              alert(`Failed: ${res?.message || "Validation Error"}`);
              return false;
            }}
            onCompleteClosed={getSchedules}
          />
        ))
      ) : null}

      {tab === "past" && pastSchedules.length === 0 ? (
        <Box textAlign="center" py={5} color="text.secondary">
          <Typography>No past meetings</Typography>
        </Box>
      ) : tab === "past" && pastSchedules.length > 0 ? (
        pastSchedules.map((mtg, i) => (
          <MeetingCard
            key={mtg.id || i}
            isUpcoming={false}
            {...formatMeetingData(mtg)}
          />
        ))
      ) : null}

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
                onClick={() => {
                  if (isTutor && formData.selectedStudents.length === 0) {
                    alert("Please select at least one student before scheduling!");
                    return;
                  }
                  handleSchedule();
                }}
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
          <SelectStudentsStep formData={formData} setFormData={setFormData} isTutor={isTutor} />
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
