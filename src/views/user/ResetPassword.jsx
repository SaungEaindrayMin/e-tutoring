import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";
import AppAlert from "../../layouts/main/components/AppAlert";

const ResetPassword = ({ open, onClose, email }) => {
  const config = new Configuration();
  const dataService = new DataServices();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showAlert("Please fill all fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);

      const body = {
        email: email,
        newPassword: password,
      };

      const res = await dataService.authorize(
        body,
        config.SERVICE_NAME + config.SERVICE_RESET_PASSWORD,
      );

      if (res?.status === "success") {
        showAlert("Password reset successful", "success");

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        showAlert(res?.message || "Reset failed", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <InputField
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              label="Confirm Password *"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              useGradient
              onClick={handleResetPassword}
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: "primary.main",
                color: "background.paper",
                ":hover": { bgcolor: "primary.light" },
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </CustomDialog>

      <AppAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </>
  );
};

export default ResetPassword;
