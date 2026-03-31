import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const PageHeader = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      flexWrap="wrap"
      gap={2}
    >
      <Box>
        <Typography variant="h3" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>

      {buttonText && (
        <Button
          variant="contained"
          color="primary"
          useGradient
          startIcon={<AddIcon />}
          onClick={onButtonClick}
          sx={{
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            py: 1,
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
