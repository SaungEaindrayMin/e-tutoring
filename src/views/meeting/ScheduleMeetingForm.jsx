import { Grid, TextField, MenuItem } from "@mui/material";

const ScheduleMeetingForm = () => {
  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12}>
        <TextField fullWidth label="Meeting Title" />
      </Grid>

      <Grid item xs={6}>
        <TextField select fullWidth label="Meeting Type">
          <MenuItem value="virtual">Virtual</MenuItem>
          <MenuItem value="physical">Physical</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField select fullWidth label="Duration">
          <MenuItem value="15">15 minutes</MenuItem>
          <MenuItem value="30">30 minutes</MenuItem>
          <MenuItem value="60">60 minutes</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField type="date" fullWidth />
      </Grid>

      <Grid item xs={6}>
        <TextField type="time" fullWidth />
      </Grid>

      <Grid item xs={12}>
        <TextField fullWidth label="Meeting Link" />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Additional Notes"
        />
      </Grid>
    </Grid>
  );
};

export default ScheduleMeetingForm;