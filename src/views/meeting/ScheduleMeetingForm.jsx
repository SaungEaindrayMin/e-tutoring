import { Box, TextField, Typography, MenuItem, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const MockCalendar = ({ value, onChange }) => {
  const selectedDate = value || "8";
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const dates = [
    ["", "", "", "1", "2", "3", "4"],
    ["5", "6", "7", "8", "9", "10", "11"],
    ["12", "13", "14", "15", "16", "17", "18"],
    ["19", "20", "21", "22", "23", "24", "25"],
    ["26", "27", "28", "", "", "", ""],
  ];

  return (
    <Box sx={{ border: "1px solid", borderColor: "text.input", borderRadius: "8px", p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={600} fontSize="0.95rem">
          February
        </Typography>
        <Box>
          <IconButton size="small">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} textAlign="center" mb={1}>
        {days.map((d) => (
          <Typography key={d} variant="body2" fontWeight={500} color="text.primary">
            {d}
          </Typography>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} rowGap={2} textAlign="center">
        {dates.flat().map((date, i) => (
          <Box
            key={i}
            onClick={() => {
              if (date && onChange) onChange(date);
            }}
            sx={{
              width: 32,
              height: 32,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              bgcolor: date === selectedDate ? "primary.main" : "transparent",
              color: date === selectedDate ? "background.paper" : "text.secondary",
              cursor: date ? "pointer" : "default",
              transition: "0.2s",
              "&:hover": {
                bgcolor: date && date !== selectedDate ? "action.hover" : date === selectedDate ? "primary.dark" : "transparent",
              }
            }}
          >
            <Typography variant="body2">{date}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ScheduleMeetingForm = ({ formData, setFormData, errors }) => {
  return (
    <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={3} mt={1}>
      <Box gridColumn={{ xs: "span 1", md: "span 2" }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Meeting Title*
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g. Academic Progress Review"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Meeting Type*
          </Typography>
          <TextField
            select
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            error={!!errors.type}
            helperText={errors.type}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return <Typography color="text.secondary">Virtual</Typography>;
                }
                return selected;
              },
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
          >
            <MenuItem value="" disabled sx={{ display: "none" }}>Virtual</MenuItem>
            <MenuItem value="Virtual">Virtual</MenuItem>
            <MenuItem value="Physical">Physical</MenuItem>
          </TextField>
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Date*
          </Typography>
          <MockCalendar
            value={formData.date}
            onChange={(newDate) => setFormData({ ...formData, date: newDate })}
          />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Notes (Optional)*
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Add any additional notes about the meeting..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            Start Time*
          </Typography>
          <TextField
            fullWidth
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            error={!!errors.startTime}
            helperText={errors.startTime}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
          />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            End Time*
          </Typography>
          <TextField
            fullWidth
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            error={!!errors.endTime}
            helperText={errors.endTime}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
          />
        </Box>

        {formData.type === "Virtual" ? (
          <>
            <Box>
              <Typography variant="body2" fontWeight={600} mb={1}>
                Meeting Link*
              </Typography>
              <TextField
                fullWidth
                placeholder="http://meet.university.edu/......"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                error={!!errors.link}
                helperText={errors.link}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
              />
            </Box>

            <Box>
              <Typography variant="body2" fontWeight={600} mb={1}>
                Platform*
              </Typography>
              <TextField
                select
                fullWidth
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                error={!!errors.platform}
                helperText={errors.platform}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return <Typography color="text.secondary">Select Platform</Typography>;
                    }
                    return selected;
                  },
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
              >
                <MenuItem value="" disabled sx={{ display: "none" }}>Select Platform</MenuItem>
                <MenuItem value="Zoom">Zoom</MenuItem>
                <MenuItem value="Google Meet">Google Meet</MenuItem>
                <MenuItem value="Teams">Teams</MenuItem>
              </TextField>
            </Box>
          </>
        ) : formData.type === "Physical" ? (
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Location*
            </Typography>
            <TextField
              fullWidth
              placeholder="Building 12"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={!!errors.location}
              helperText={errors.location}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px" } }}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default ScheduleMeetingForm;