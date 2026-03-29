import { Box, TextField, Typography, MenuItem, IconButton, InputAdornment } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useState, useEffect } from "react";

const CustomCalendar = ({ value, onChange, error }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Parse value if it's passed from formData.date
  // value might be just a day string "9", or a full date like "Feb 9, 2026"
  let selectedDate = null;
  if (value) {
    if (value.toString().includes(" ")) {
      selectedDate = new Date(value);
    } else {
      // If it's just a number string from the old mock, assume current month/year
      const dayNum = parseInt(value, 10);
      if (!isNaN(dayNum)) {
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
      }
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);

  // Get first day of month (0 = Sunday, 1 = Monday ...)
  let firstDay = new Date(year, month, 1).getDay();
  // Adjust to make Monday = 0, Sunday = 6
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
  // We need 42 slots (6 weeks x 7 days)
  const dates = [];
  for (let i = 0; i < 42; i++) {
    if (i < firstDay) {
      dates.push("");
    } else if (i < firstDay + daysInMonth) {
      dates.push((i - firstDay + 1).toString());
    } else {
      dates.push("");
    }
  }

  return (
    <Box sx={{ border: "1px solid", borderColor: error ? "error.main" : "text.input", borderRadius: "8px", p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={600} fontSize="0.95rem">
          {monthName} {year}
        </Typography>
        <Box>
          <IconButton size="small" onClick={handlePrevMonth}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleNextMonth}>
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
        {dates.map((date, i) => {
          const isSelected = selectedDate && date 
            && parseInt(date, 10) === selectedDate.getDate()
            && month === selectedDate.getMonth()
            && year === selectedDate.getFullYear();

          return (
            <Box
              key={i}
              onClick={() => {
                if (date && onChange) {
                  const newDate = new Date(year, month, parseInt(date, 10));
                  // Format as "MMM D, YYYY" for consistency with existing data
                  const formatted = new Intl.DateTimeFormat('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  }).format(newDate);
                  
                  onChange(formatted);
                }
              }}
              sx={{
                width: 32,
                height: 32,
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                bgcolor: isSelected ? "primary.main" : "transparent",
                color: isSelected ? "background.paper" : "text.secondary",
                cursor: date ? "pointer" : "default",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: date && !isSelected ? "action.hover" : isSelected ? "primary.dark" : "transparent",
                }
              }}
            >
              <Typography variant="body2">{date}</Typography>
            </Box>
          );
        })}
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
          <Typography variant="body2" fontWeight={600} mb={1} color={errors.date ? "error.main" : "text.primary"}>
            Date*
          </Typography>
          <CustomCalendar
            value={formData.date}
            onChange={(newDate) => setFormData({ ...formData, date: newDate })}
            error={!!errors.date}
          />
          {errors.date && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: "block" }}>
              {errors.date}
            </Typography>
          )}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ pointerEvents: "none", mr: 1 }}>
                  <AccessTimeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              "& .MuiOutlinedInput-root": { borderRadius: "6px", position: "relative" },
              "& input[type='time']::-webkit-calendar-picker-indicator": {
                opacity: 0,
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "48px",
                height: "100%",
                cursor: "pointer",
              }
            }}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ pointerEvents: "none", mr: 1 }}>
                  <AccessTimeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              "& .MuiOutlinedInput-root": { borderRadius: "6px", position: "relative" },
              "& input[type='time']::-webkit-calendar-picker-indicator": {
                opacity: 0,
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "48px",
                height: "100%",
                cursor: "pointer",
              }
            }}
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