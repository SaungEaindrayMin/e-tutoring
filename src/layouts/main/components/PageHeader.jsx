import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const PageHeader = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      {buttonText && (
        <Button
          startIcon={<AddIcon />}
          onClick={onButtonClick}
          sx={{
            bgcolor: "primary.main",
            color: "background.paper",
            ":hover": { bgcolor: "primary.light" },
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
