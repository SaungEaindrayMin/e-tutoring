import {
  Box,
  MenuItem,
  Button,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import { useState } from "react";

const CreateAccountDialog = ({ open, onClose }) => {
  const dataService = new DataServices();
  const config = new Configuration();
  const [formData, setFormData] = useState({
    role: "STUDENT",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateAccount = async () => {
    if (formData.password !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    try {
      setLoading(true);

      const response = await dataService.retrievePOST(
        payload,
        config.SERVICE_NAME + config.SERVICE_CREATE_USER,
      );

      if (response?.status === "success") {
        setSnackbar({
          open: true,
          type: "success",
          message: "Account created successfully!",
        });

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          type: "error",
          message: response?.message || "Failed to create account",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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

          <InputField
            select
            label="I am a *"
            value={formData.role}
            disabled={loading}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <MenuItem value="STUDENT">Student</MenuItem>
            <MenuItem value="TUTOR">Tutor</MenuItem>
            <MenuItem value="STAFF">Staff</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </InputField>

          <Box display="flex" gap={2}>
            <InputField
              label="Full Name *"
              value={formData.name}
              disabled={loading}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <InputField
              label="University Email *"
              value={formData.email}
              disabled={loading}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Box>

          <Box display="flex" gap={2}>
            <InputField
              label="Password *"
              type="password"
              value={formData.password}
              disabled={loading}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <InputField
              label="Confirm Password *"
              type="password"
              value={formData.confirmPassword}
              disabled={loading}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </Box>
          <Button
            fullWidth
            size="large"
            onClick={handleCreateAccount}
            disabled={loading}
            sx={{
              mt: 3,
              bgcolor: "primary.main",
              color: "background.paper",
              ":hover": { bgcolor: "primary.light" },
            }}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </Box>
      </CustomDialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateAccountDialog;
