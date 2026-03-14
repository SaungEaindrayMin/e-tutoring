import { Box, Button, Typography } from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";

const ResetPassword = ({ open, onClose }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          color="primary.main"
        >
          Reset Password
        </Typography>
      }
    >
      <Box p={2}>
        <Box>
          <InputField label="Password *" type="password" />
          <InputField label="Confirm Password *" type="password" />
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
          Save Changes
        </Button>
      </Box>
    </CustomDialog>
  );
};

export default ResetPassword;
