import { Box, TextField, Typography, MenuItem, IconButton, InputAdornment, Popover, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useEffect, useRef } from "react";

const format12h = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);
  const m = minutes || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${m} ${ampm}`;
};

const parseTo24h = (h, m, ampm) => {
  let hours = parseInt(h, 10);
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const CustomTimePicker = ({ value, onChange, error, placeholder }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const triggerRef = useRef(null);

  // Split current value into parts
  const displayValue = format12h(value);
  
  const now = new Date();
  let initialH = (now.getHours() % 12 || 12).toString().padStart(2, "0");
  let initialM = now.getMinutes().toString().padStart(2, "0");
  let initialAMPM = now.getHours() >= 12 ? "PM" : "AM";
  
  if (displayValue) {
    const [time, ampm] = displayValue.split(" ");
    const [h, m] = time.split(":");
    initialH = h;
    initialM = m;
    initialAMPM = ampm;
  }

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const periods = ["AM", "PM"];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    // If no value is selected yet, auto-select "now"
    if (!value) {
      const now = new Date();
      const h = (now.getHours() % 12 || 12).toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const p = now.getHours() >= 12 ? "PM" : "AM";
      handleSelect(h, m, p);
    }
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (h, m, p) => {
    const new24h = parseTo24h(h, m, p);
    onChange(new24h);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        fullWidth
        ref={triggerRef}
        value={displayValue}
        placeholder={placeholder}
        error={error}
        onClick={handleOpen}
        autoComplete="off"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end" sx={{ cursor: "pointer" }}>
              <AccessTimeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{ 
            "& .MuiOutlinedInput-root": { borderRadius: "6px", cursor: "pointer" },
            "& input": { cursor: "pointer" }
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: "12px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ display: "flex", height: 260, p: 0.5 }}>
          {/* Hours */}
          <Box sx={{ flex: 1, overflowY: "auto", borderRight: "1px solid", borderColor: "divider", "&::-webkit-scrollbar": { width: 0 } }}>
            <List sx={{ p: 0 }}>
              {hours.map((h) => (
                <ListItem key={h} disablePadding>
                  <ListItemButton
                    selected={initialH === h}
                    onClick={() => handleSelect(h, initialM, initialAMPM)}
                    sx={{
                      textAlign: "center",
                      py: 0.8,
                      "&.Mui-selected": { 
                        background: "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",
                        color: "white",
                        "&:hover": { 
                          background: "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",
                        }
                      }
                    }}
                  >
                    <ListItemText primary={h} primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: initialH === h ? 700 : 400 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Minutes */}
          <Box sx={{ flex: 1, overflowY: "auto", borderRight: "1px solid", borderColor: "divider", "&::-webkit-scrollbar": { width: 0 } }}>
            <List sx={{ p: 0 }}>
              {minutes.map((m) => (
                <ListItem key={m} disablePadding>
                  <ListItemButton
                    selected={initialM === m}
                    onClick={() => handleSelect(initialH, m, initialAMPM)}
                    sx={{
                      textAlign: "center",
                      py: 0.8,
                      "&.Mui-selected": { 
                        background: "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",
                        color: "white",
                        "&:hover": { 
                          background: "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",
                        }
                      }
                    }}
                  >
                    <ListItemText primary={m} primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: initialM === m ? 700 : 400 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Period */}
          <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { width: 0 } }}>
            <List sx={{ p: 0 }}>
              {periods.map((p) => (
                <ListItem key={p} disablePadding>
                  <ListItemButton
                    selected={initialAMPM === p}
                    onClick={() => handleSelect(initialH, initialM, p)}
                    sx={{
                      textAlign: "center",
                      py: 0.8,
                      "&.Mui-selected": { 
                        background: "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",
                        color: "white",
                        "&:hover": { 
                          background: "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",
                        }
                      }
                    }}
                  >
                    <ListItemText primary={p} primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: initialAMPM === p ? 700 : 400 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        
        <Divider />
        <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
            <ListItemButton 
                onClick={handleClose}
                sx={{ 
                    borderRadius: "6px", 
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",
                    color: "white",
                    width: "90%",
                    py: 0.5,
                    "&:hover": { 
                        background: "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",
                    }
                }}
            >
                <Typography variant="body2" fontWeight={700}>Done</Typography>
            </ListItemButton>
        </Box>
      </Popover>
    </>
  );
};

const CustomCalendar = ({ value, onChange, error }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // value might be an ISO string "2026-04-20T00:00:00.000Z" or formatted string "Apr 20, 2026"
  let selectedDate = null;
  if (value) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      selectedDate = d;
    }
  }

  // Sync calendar view month with selectedDate when it changes (e.g. on mount/edit)
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]); // Depend on value string to trigger sync

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

          const today = new Date();
          const isToday = date 
            && parseInt(date, 10) === today.getDate()
            && month === today.getMonth()
            && year === today.getFullYear();

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
                background: isSelected ? "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)" : "transparent",
                color: isSelected ? "background.paper" : isToday ? "primary.main" : "text.secondary",
                border: isToday && !isSelected ? "1px solid" : "none",
                borderColor: "primary.main",
                fontWeight: isToday || isSelected ? 600 : 400,
                cursor: date ? "pointer" : "default",
                transition: "0.2s",
                "&:hover": {
                  background: date && !isSelected ? "action.hover" : isSelected ? "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)" : "transparent",
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "inherit" }}>{date}</Typography>
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

        <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: "360px" }, mx: { xs: 0, sm: "auto", md: 0 } }}>
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
          <CustomTimePicker
            value={formData.startTime}
            onChange={(newVal) => setFormData({ ...formData, startTime: newVal })}
            error={!!errors.startTime}
            placeholder="Select Start Time"
          />
          {errors.startTime && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: "block" }}>
              {errors.startTime}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography variant="body2" fontWeight={600} mb={1}>
            End Time*
          </Typography>
          <CustomTimePicker
            value={formData.endTime}
            onChange={(newVal) => setFormData({ ...formData, endTime: newVal })}
            error={!!errors.endTime}
            placeholder="Select End Time"
          />
          {errors.endTime && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: "block" }}>
              {errors.endTime}
            </Typography>
          )}
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