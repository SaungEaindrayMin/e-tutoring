import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const TabSwitcher = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(e, newValue) => newValue && onChange(newValue)}
      sx={{
        backgroundColor: "background.switch",
        borderRadius: 2,
        padding: "4px",
      }}
    >
      <ToggleButton
        value="upcoming"
        sx={{
          textTransform: "none",
          border: "none",
          borderRadius: 2,
          px: 3,
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "background.paper",
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
          borderRadius:2,
          px: 3,
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "background.paper",
          },
        }}
      >
        Past (1)
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TabSwitcher;