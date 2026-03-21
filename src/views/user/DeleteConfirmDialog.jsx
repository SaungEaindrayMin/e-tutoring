import { Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import AppAlert from "../../layouts/main/components/AppAlert";

const DeleteConfirmDialog = ({ open, onClose, userId, onSuccess }) => {
  const dataService = new DataServices();
  const config = new Configuration();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const handleDelete = async () => {
    if (!userId) return;

    const response = await dataService.retrieveDELETE(
      config.SERVICE_NAME + config.SERVICE_USERS,
      `/${userId}`,
    );

    if (response?.success !== false) {
      setAlert({
        open: true,
        message: "Account deleted successfully",
        type: "success",
      });

      onSuccess?.();

      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setAlert({
        open: true,
        message: response?.message || "Delete failed",
        type: "error",
      });
    }
  };

  return (
    <>
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

      <AppAlert
        open={alert.open}
        severity={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </>
  );
};

export default DeleteConfirmDialog;
