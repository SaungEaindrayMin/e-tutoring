import { Button, Typography, Box } from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";

const DeleteConfirmDialog = ({ open, onClose, userId, onSuccess }) => {
  const dataService = new DataServices();
  const config = new Configuration();

  const handleDelete = async () => {
    if (!userId) return;

    const response = await dataService.retrieveDELETE(
      config.SERVICE_NAME + config.SERVICE_USERS,
      `/${userId}`,
    );

    if (response?.success !== false) {
      onClose();
      onSuccess?.();
    } else {
      alert(response?.message || "Delete failed");
    }
  };

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

          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DeleteConfirmDialog;
