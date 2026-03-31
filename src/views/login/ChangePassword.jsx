import { Box, Button, Typography } from "@mui/material";
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
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || sessionStorage.getItem("reset_email");
  const otp = location.state?.otp || sessionStorage.getItem("reset_otp");

  const config = new Configuration();
  const dataService = new DataServices();

  const handleSave = async () => {
    const newErrors = {};

    if (!password) newErrors.password = "Please fill your password!";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please fill your confirm password!";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!email || !otp)
      newErrors.general = "Session expired. Please try again.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    const param = { email, otp, newPassword: password };

    try {
      const res = await dataService.authorize(
        param,
        config.SERVICE_NAME + config.SERVICE_RESET_PASSWORD,
      );

      setLoading(false);

      if (res?.status === "success") {
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setErrors({ general: res?.message || "Failed to reset password." });
      }
    } catch (err) {
      setLoading(false);
      setErrors({ general: "Network error. Please try again." });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSave();
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
        Your new password must be different from previously used passwords
      </Typography>

      {errors.general && (
        <Typography variant="body2" color="error" align="center" mb={2}>
          {errors.general}
        </Typography>
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
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors({ ...errors, password: "", general: "" });
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Box>

      <Box mb={3}>
        <Typography variant="body2" fontWeight={600}>
          Confirm Password
        </Typography>
        <InputField
          icon={LockOutlinedIcon}
          type="password"
          placeholder="Enter your confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrors({ ...errors, confirmPassword: "", general: "" });
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
      </Box>

      <Button
        fullWidth
        size="large"
        onClick={handleSave}
        disabled={loading}
        color="primary"
        useGradient
             sx={{mt:2}}

      >
        {loading ? "Continue..." : "Continue"}
      </Button>
    </AuthContainer>
  );
};

export default ChangePassword;
