import { Button, Typography, Box } from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";

const DeleteConfirmDialog = ({ open, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box textAlign="center" py={2}>
        <Typography variant="h6" fontWeight={600}>
          Delete Account?
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          This account will be deleted.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" color="error">
            Delete
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DeleteConfirmDialog;
