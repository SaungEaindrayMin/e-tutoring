import { Box, MenuItem, Button, Typography } from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";

const CreateAccountDialog = ({ open, onClose }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          color="primary.main"
        >
          Create Account
        </Typography>
      }
    >
      <Box p={2}>
        <Typography textAlign="center" color="text.secondary" mb={3}>
          Create your account to access the personal tutoring platform
        </Typography>

        <InputField select label="I am a *" defaultValue="Student">
          <MenuItem value="Student">Student</MenuItem>
          <MenuItem value="Tutor">Tutor</MenuItem>
        </InputField>


        <Box display="flex" gap={2}>
          <InputField label="Full Name *" />
          <InputField label="University Email *" />
        </Box>

        <Box display="flex" gap={2}>
          <InputField label="Password *" type="password" />
          <InputField label="Confirm Password *" type="password" />
        </Box>

        <Box
          mt={3}
          p={2}
          bgcolor="primary.active"
          borderRadius={0.5}
          textAlign="center"
          color="primary.dark"
        >
          <Typography variant="body2" px={20} fontWeight={500}>
            By registering, you agree to the university's terms of service and
            privacy policy. A personal tutor will be assigned to you.
          </Typography>
        </Box>

        <Button
          fullWidth
          size="large"
          sx={{
            mt: 3,
            bgcolor: "primary.main",
            color: "background.paper",
            ":hover": { bgcolor: "primary.light" },
          }}
        >
          Create Account
        </Button>
      </Box>
    </CustomDialog>
  );
};

export default CreateAccountDialog;
