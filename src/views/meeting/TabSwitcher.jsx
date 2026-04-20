import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const TabSwitcher = ({ value, onChange, upcomingCount = 0, pastCount = 0 }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(e, newValue) => newValue && onChange(newValue)}
      sx={{
        backgroundColor: "background.switch",
        borderRadius: "999px",
        padding: "4px",
        mb: 3
      }}
    >
      <ToggleButton
        value="upcoming"
        sx={{
          textTransform: "none",
          border: "none",
          borderRadius: "999px",
          px: { xs: 2, sm: 3 },
          fontSize: { xs: "0.8rem", sm: "0.875rem" },
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",
            color: "background.paper",
            "&:hover": { 
              background: "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",
            }
          },
        }}
      >
        Upcoming ({upcomingCount})
      </ToggleButton>

      <ToggleButton
        value="past"
        sx={{
          textTransform: "none",
          border: "none",
          borderRadius: "999px",
          px: { xs: 2, sm: 3 },
          fontSize: { xs: "0.8rem", sm: "0.875rem" },
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",
            color: "background.paper",
            "&:hover": { 
              background: "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",
            }
          },
        }}
      >
        Past ({pastCount})
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TabSwitcher;