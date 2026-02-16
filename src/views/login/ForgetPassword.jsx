import { Box, Button, Typography, Alert } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";
import AuthContainer from "../../layouts/main/components/AuthContainer";
import InputField from "../../layouts/main/components/InputFields";
import icon from "../../assets/images/forgotpassword.svg";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";
import { useState } from "react";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const config = new Configuration();
  const dataService = new DataServices();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    setLoading(true);

    const param = {
      email: email,
    };

    try {
      const res = await dataService.authorize(
        param,
        config.SERVICE_NAME + config.SERVICE_FORGET_PASSWORD,
      );

      setLoading(false);

      if (res?.status === "success") {
        setSuccessMessage(res.message || "Instructions sent successfully!");
        navigate("/email-otp-verify", { state: { email } });
      } else {
        setErrorMessage(res?.message || "Failed to send instructions");
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Network error: Unable to connect to server");
    }
  };

  return (
    <AuthContainer>
      <Box mb={8}>
        <Typography
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            cursor: "pointer",
            color: "text.muted",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <ArrowBack fontSize="small" />
          <Typography variant="body2" color="text.primary" fontWeight={600}>
            Back
          </Typography>
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mb={2}>
        <Box width={64} height={64}>
          <img
            src={icon}
            alt="Forgot password"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>

      <Typography variant="h3" align="center" gutterBottom color="primary.main">
        Forgot Password
      </Typography>

      <Typography variant="body2" align="center" color="text.secondary" mb={3}>
        Enter the email associated with your account and we’ll send instructions
        to reset your password.
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box mb={3}>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          Email address
        </Typography>

        <InputField
          icon={EmailOutlinedIcon}
          type="email"
          placeholder="name@university.edu"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <Button
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          mt: 3,
          bgcolor: "primary.main",
          color: "background.paper",
          ":hover": { bgcolor: "primary.light" },
        }}
      >
        {loading ? "Sending..." : "Send Instructions"}
      </Button>
    </AuthContainer>
  );
};

export default ForgetPassword;
