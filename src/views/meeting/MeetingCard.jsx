import { useState } from "react";
import { Box, Typography, Button, Dialog, IconButton } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseIcon from "@mui/icons-material/Close";

const MeetingCard = ({ title, date, time, link, location, student, note, tutor, status, type = "Virtual", isUpcoming = false, onEdit, onDelete, onComplete, onCompleteClosed }) => {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const handleCancelClick = () => setCancelOpen(true);
  const handleCloseCancel = () => setCancelOpen(false);
  const handleConfirmCancel = () => {
    if (onDelete) onDelete();
    setCancelOpen(false);
  };

  const handleCompleteClick = async () => {
    if (onComplete) {
      const success = await onComplete();
      if (success) setCompleteOpen(true);
    } else {
      setCompleteOpen(true);
    }
  };
  
  const handleCloseComplete = () => {
    setCompleteOpen(false);
    if (onCompleteClosed) onCompleteClosed();
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "text.input",
        bgcolor: "background.paper",
        mb: 2,
      }}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="flex-start" 
        mb={2}
        sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 0 } }}
      >
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
          {title}
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Box sx={{ bgcolor: "primary.main", color: "white", px: 1.5, py: 0.5, borderRadius: "6px" }}>
            <Typography variant="caption" fontWeight={600}>{type}</Typography>
          </Box>
          {status && (
            <Box sx={{ bgcolor: status === "Completed" ? "#E6F4EA" : "primary.light", color: status === "Completed" ? "#137333" : "primary.main", px: 1.5, py: 0.5, borderRadius: "6px" }}>
              <Typography variant="caption" fontWeight={600}>{status}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1.5} mb={2.5}>
        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
          <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">{date}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
          <AccessTimeIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">{time}</Typography>
        </Box>
        {link && (
          <Box display="flex" alignItems="center" gap={1} color="primary.main">
            <VideocamOutlinedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <Typography 
              variant="body2" 
              fontWeight={500} 
              sx={{ 
                cursor: "pointer",
                wordBreak: "break-all",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {link}
            </Typography>
          </Box>
        )}
        {location && (
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <LocationOnOutlinedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>{location}</Typography>
          </Box>
        )}
      </Box>

      {student && (
        <Typography variant="body2" color="text.primary" mb={1} sx={{ wordBreak: "break-word" }}>
          Student: {typeof student === 'object' ? (student.user?.firstName ? `${student.user.firstName} ${student.user.lastName || ''}` : student.user?.name || student.name || JSON.stringify(student)) : student}
        </Typography>
      )}
      {note && (
        <Typography variant="body2" color="text.primary" mb={1} sx={{ wordBreak: "break-word" }}>
          Note: {note}
        </Typography>
      )}
      {tutor && (
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
          Tutor: {typeof tutor === 'object' ? (tutor.user?.firstName ? `${tutor.user.firstName} ${tutor.user.lastName || ''}` : tutor.user?.name || tutor.name || JSON.stringify(tutor)) : tutor}
        </Typography>
      )}

      {isUpcoming && (
        <Box display="flex" gap={1.5} mt={3} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: "18px !important" }} />}
            onClick={onEdit}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              color: "text.primary",
              borderColor: "text.input",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2,
              py: 0.5,
              minWidth: "auto",
              "&:hover": { borderColor: "text.secondary", bgcolor: "background.switch" }
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleOutlineIcon sx={{ fontSize: "18px !important" }} />}
            onClick={handleCompleteClick}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              color: "#137333",
              bgcolor: "#E6F4EA",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2,
              py: 0.5,
              minWidth: "auto",
              boxShadow: "none",
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#D7E9D1", boxShadow: "none" }
            }}
          >
            Make Complete
          </Button>
          <Button
            variant="contained"
            startIcon={<CancelOutlinedIcon sx={{ fontSize: "18px !important" }} />}
            onClick={handleCancelClick}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              color: "#D32F2F",
              bgcolor: "#FDE7E9",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2,
              py: 0.5,
              minWidth: "auto",
              boxShadow: "none",
              "&:hover": { bgcolor: "#FAD2D6", boxShadow: "none" }
            }}
          >
            Cancel
          </Button>
        </Box>
      )}

      <Dialog
        open={cancelOpen}
        onClose={handleCloseCancel}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "400px",
            p: 3,
            position: "relative",
          }
        }}
      >
        <IconButton
          onClick={handleCloseCancel}
          sx={{ position: "absolute", top: 12, right: 12, color: "text.secondary" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" fontWeight={700} textAlign="center" mt={2} mb={1}>
          Cancel Meeting?
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
          Your meeting will be deleted.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            onClick={handleCloseCancel}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: 600,
              color: "text.primary",
              borderColor: "text.input",
              px: 4,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmCancel}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: 600,
              px: 4,
              py: 1,
              boxShadow: "none",
            }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
      <Dialog
        open={completeOpen}
        onClose={handleCloseComplete}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "400px",
            p: 4,
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={4} mt={3}>
          <CheckCircleOutlineIcon sx={{ fontSize: 24, color: "text.primary" }} />
          <Typography variant="h6" fontWeight={700} textAlign="center">
            Meeting marked as completed!
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb={1}>
          <Button
            variant="contained"
            onClick={handleCloseComplete}
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

export default MeetingCard;
