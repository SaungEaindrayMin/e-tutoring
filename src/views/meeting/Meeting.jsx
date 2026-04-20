import { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog, CircularProgress } from "@mui/material";
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
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const getSchedules = async () => {
    setLoading(true);
    try {
      const userStr = Cookies.get(config.COOKIE_NAME_USER);
      let currentUser = null;
      try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
      const currentUserId = currentUser?.id || currentUser?.userId || null;

      if (!currentUserId) {
        console.error("No user ID found in cookies");
        setLoading(false);
        return;
      }

      // Fetch full profile to get specific role IDs (Tutor ID or Student ID)
      const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
      let filterParams = "?page=1&limit=50";

      if (profileRes?.status === "success" && profileRes.data) {
        const fullProfile = profileRes.data;
        if (isTutor && fullProfile.tutorProfile?.id) {
          filterParams += `&tutorId=${fullProfile.tutorProfile.id}`;
        } else if (!isTutor && fullProfile.studentProfile?.id) {
          filterParams += `&studentId=${fullProfile.studentProfile.id}`;
        }
      }

      const response = await dataService.retrieve("/v1/schedule", filterParams);

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
    } catch (err) {
      console.error("Error in getSchedules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSchedules();
  }, [isTutor]);

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
      student: mtg.students && mtg.students.length > 0
        ? mtg.students.map(s => s.user?.name).filter(Boolean).join(", ")
        : mtg.student?.user?.name,
      tutor: mtg.tutor?.user?.name,
      note: mtg.note,
      status: mtg.isCompleted ? "Completed" : null,
    };
  };

  const upcomingSchedules = schedules.filter(s => !s.isCompleted);
  const pastSchedules = schedules.filter(s => s.isCompleted);


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
    
    const now = new Date();
    const currentH = now.getHours();
    const currentM = now.getMinutes(); // Removing rounding for better "live" feel
    
    const formatTime = (h, m) => `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    const startTimeStr = formatTime(currentH, currentM);
    const endTimeStr = formatTime((currentH + 1) % 24, currentM);

    const todayStr = new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(now);

    setFormData({ 
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
      selectedStudents: [] 
    });
    setErrors({});
  };

  const handleEdit = (mtg) => {
    setOpen(true);
    setStep(1);
    setErrors({});

    let typeVal = mtg.type === "IN_PERSON" ? "Physical" : "Virtual";


    const extractTime = (timeStr) => {
      if (!timeStr) return "";
      const d = new Date(timeStr);
      return isNaN(d) ? "" : `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
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
      try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
      const currentUserId = currentUser?.id || currentUser?.userId || null;

      const extractId = (obj, roleKey) => {
        if (!obj) return null;
        if (obj[`${roleKey}Profile`]?.id) return obj[`${roleKey}Profile`].id;
        if (obj[roleKey]?.id) return obj[roleKey].id;
        if (obj[`${roleKey}Id`]) return obj[`${roleKey}Id`];
        return obj.id || obj;
      };

      let studentIds = isTutor
        ? formData.selectedStudents.map(s => extractId(s, 'student')).filter(Boolean)
        : [extractId(currentUser, 'student')].filter(Boolean);

      let tutorId = isTutor
        ? extractId(currentUser, 'tutor')
        : (formData.selectedStudents.length > 0 ? extractId(formData.selectedStudents[0], 'tutor') : null);

      let fetchedProfile = null;

      if ((!isTutor && studentIds.length > 0 && studentIds[0] === currentUserId) || (isTutor && tutorId === currentUserId)) {
        try {
          const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
          if (profileRes?.status === "success" && profileRes.data) {
            fetchedProfile = profileRes.data;
            if (!isTutor) studentIds = [extractId(fetchedProfile, 'student')].filter(Boolean);
            if (isTutor) tutorId = extractId(fetchedProfile, 'tutor');
          }
        } catch (e) {
          console.warn("Failed to fetch current user profile bindings:", e);
        }
      }


      if (!isTutor && !tutorId) {

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
        payload.studentIds = studentIds;
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    
    // Refresh list first
    getSchedules();

    // Prepare fresh defaults for next open
    const now = new Date();
    const formatTime = (h, m) => `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    const todayStr = new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }).format(now);

    setFormData({ 
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
      selectedStudents: [] 
    });
    setStep(1);
    setErrors({});
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
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

      {loading ? (
        <Box display="flex" justifyContent="center" py={12}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                variant="contained"
                color="primary"
                useGradient
                onClick={handleOpen}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.2,
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
                  setDeletingId(mtg.id);
                  try {
                    const res = await dataService.retrieveDELETE("/v1/schedule/", mtg.id);
                    if (res && (res.status === "success" || Object.keys(res).length === 0)) {
                      await getSchedules();
                    } else {
                      console.error("Failed to delete schedule", res);
                    }
                  } catch (err) {
                    console.error("Delete error:", err);
                  } finally {
                    setDeletingId(null);
                  }
                }}
                onComplete={async () => {
                  setCompletingId(mtg.id);
                  try {
                    const extractT = (t) => {
                      if (!t) return "";
                      const d = new Date(t);
                      return isNaN(d) ? t : `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
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
                  } catch (err) {
                    console.error("Complete error:", err);
                    return false;
                  } finally {
                    setCompletingId(null);
                  }
                }}
                onCompleteClosed={getSchedules}
                isDeleting={deletingId === mtg.id}
                isCompleting={completingId === mtg.id}
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
        </>
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
                color="primary"
                useGradient
                onClick={handleNext}
                disabled={submitting}
                startIcon={(!submitting && !isTutor) ? <AddIcon /> : undefined}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  px: { xs: 3, sm: 5 },
                  py: 1.2,
                }}
              >
                {submitting ? <CircularProgress size={20} thickness={2.5} sx={{ color: "white" }} /> : (isTutor ? "Next" : "Schedule Meeting")}
              </Button>
            </Box>
          ) : (
            <Box display="flex" justifyContent="flex-end" gap={2} width="100%" px={1} py={1} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
              <Button
                variant="outlined"
                startIcon={!submitting ? <ArrowBackIcon /> : undefined}
                onClick={() => setStep(1)}
                disabled={submitting}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  color: "text.secondary",
                  borderColor: "text.input",
                  order: { xs: 2, sm: 1 }
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                useGradient
                startIcon={!submitting ? <AddIcon /> : undefined}
                disabled={submitting}
                onClick={() => {
                  if (isTutor && formData.selectedStudents.length === 0) {
                    alert("Please select at least one student before scheduling!");
                    return;
                  }
                  handleSchedule();
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  order: { xs: 1, sm: 2 }
                }}
              >
                {submitting ? <CircularProgress size={20} thickness={2.5} sx={{ color: "white" }} /> : "Schedule Meeting"}
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
            width: "calc(100% - 32px)",
            maxWidth: "500px",
            p: { xs: 3, sm: 4 },
            m: 2
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={4} mt={2}>
          <CheckCircleOutlineIcon sx={{ fontSize: 24, color: "text.primary" }} />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
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
