import { Box, Button, Link, Typography, Alert } from "@mui/material";
import AuthContainer from "../../layouts/main/components/AuthContainer";
import icon from "../../assets/images/otp.svg";
import { useRef, useState } from "react";
import InputField from "../../layouts/main/components/InputFields";
import { useNavigate, useLocation } from "react-router-dom";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const OTP_LENGTH = 6;

const OtpVerify = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const config = new Configuration();
  const dataService = new DataServices();

  const otpValue = otp.join("");
  const otpValid = otpValue.length === OTP_LENGTH;

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp([...newOtp, ...Array(OTP_LENGTH - newOtp.length).fill("")]);
    inputsRef.current[pasted.length - 1]?.focus();
  };

  const handleVerify = async () => {
    setVerificationAttempted(true);
    setErrorMessage("");

    if (!otpValid) return;

    setLoading(true);

    const param = {
      email: email,
      otp: otpValue,
    };

    try {
      const res = await dataService.authorize(
        param,
        config.SERVICE_NAME + config.SERVICE_OTP_VERIFY,
      );

      setLoading(false);

      if (res?.status === "success") {
        navigate("/change-password", { state: { email } });
      } else {
        setErrorMessage(res?.message || "Invalid OTP");
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Network error. Try again.");
    }
  };

  return (
    <AuthContainer>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box width={72} height={72}>
          <img src={icon} alt="OTP" style={{ width: "100%", height: "100%" }} />
        </Box>
      </Box>

      <Typography variant="h3" align="center" gutterBottom color="primary.main">
        OTP Verification
      </Typography>

      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        mb={3}
        px={5}
      >
        Enter the 6-digit code sent to {email}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box display="flex" justifyContent="center" gap={1} mb={6}>
        {otp.map((value, index) => (
          <InputField
            key={index}
            otp
            value={value}
            inputRef={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              style: { textAlign: "center", fontSize: 16 },
            }}
            error={verificationAttempted && !otpValid}
          />
        ))}
      </Box>

      <Button
        fullWidth
        size="large"
        onClick={handleVerify}
        disabled={loading}
        sx={{
          bgcolor: "primary.main",
          color: "background.paper",
          ":hover": { bgcolor: "primary.light" },
        }}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </Button>
    </AuthContainer>
  );
};

export default OtpVerify;
