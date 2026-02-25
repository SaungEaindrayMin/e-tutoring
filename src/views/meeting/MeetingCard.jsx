import { Card, Box, Typography, Chip } from "@mui/material";

const MeetingCard = ({ title, date, time, tutor, status }) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 1,
        my: 3,
        boxDecorationBreak: "unset",
        background: "background.switch",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        <Box>
          <Chip label="Virtual" sx={{ mr: 1 }} />
          <Chip
            label={status}
            color={status === "Completed" ? "success" : "primary"}
          />
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" mt={2}>
        {date}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {time}
      </Typography>

      <Typography variant="body2" mt={1}>
        Tutor: {tutor}
      </Typography>
    </Card>
  );
};

export default MeetingCard;
