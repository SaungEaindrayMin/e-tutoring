import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const TabSwitcher = ({ value, onChange }) => {
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
          px: 3,
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "background.paper",
            "&:hover": { backgroundColor: "primary.dark" }
          },
        }}
      >
        Upcoming (0)
      </ToggleButton>

      <ToggleButton
        value="past"
        sx={{
          textTransform: "none",
          border: "none",
          borderRadius: "999px",
          px: 3,
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "background.paper",
            "&:hover": { backgroundColor: "primary.dark" }
          },
        }}
      >
        Past (1)
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TabSwitcher;