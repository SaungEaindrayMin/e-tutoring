import { Box, Button, Typography, Alert } from "@mui/material";
import AuthContainer from "../../layouts/main/components/AuthContainer";
import InputField from "../../layouts/main/components/InputFields";
import icon from "../../assets/images/newpassword.svg";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";
import { useState } from "react";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || sessionStorage.getItem("reset_email");
  const otp = location.state?.otp || sessionStorage.getItem("reset_otp");

  const config = new Configuration();
  const dataService = new DataServices();

  const handleSave = async () => {
    setAlert({ type: "", message: "" });

    if (!password || !confirmPassword) {
      setAlert({ type: "error", message: "Both fields are required." });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (!email || !otp) {
      setAlert({
        type: "error",
        message: "Session expired. Please try again.",
      });
      return;
    }

    setLoading(true);

    const param = {
      email: email,
      otp: otp,
      newPassword: password,
    };

    try {
      const res = await dataService.authorize(
        param,
        config.SERVICE_NAME + config.SERVICE_RESET_PASSWORD,
      );

      setLoading(false);

      if (res?.status === "success") {
        setAlert({
          type: "success",
          message: res.message || "Password changed successfully!",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message: res?.message || "Failed to reset password",
        });
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <AuthContainer>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box width={72} height={72}>
          <img
            src={icon}
            alt="New password"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>

      <Typography variant="h3" align="center" gutterBottom color="primary.main">
        Create new password
      </Typography>

      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        mb={3}
        px={5}
      >
        Your new password must be different from previous password
      </Typography>

      {alert.message && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box mb={3}>
        <Typography variant="body2" fontWeight={600}>
          Password
        </Typography>
        <InputField
          icon={LockOutlinedIcon}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600}>
          Confirm Password
        </Typography>
        <InputField
          icon={LockOutlinedIcon}
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </Box>

      <Button
        fullWidth
        size="large"
        onClick={handleSave}
        disabled={loading}
        sx={{
          mt: 3,
          bgcolor: "primary.main",
          color: "background.paper",
          ":hover": { bgcolor: "primary.light" },
        }}
      >
        {loading ? "Saving..." : "Continue"}
      </Button>
    </AuthContainer>
  );
};

export default ChangePassword;
