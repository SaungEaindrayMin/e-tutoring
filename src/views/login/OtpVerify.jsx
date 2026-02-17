import { Box, Button, Link, Typography, Alert } from "@mui/material";
import AuthContainer from "../../layouts/main/components/AuthContainer";
import icon from "../../assets/images/otp.svg";
import { useEffect, useRef, useState } from "react";
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
  const RESEND_TIME = 600;
  const [timer, setTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);
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

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    if (!canResend) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await dataService.authorize(
        { email },
        config.SERVICE_NAME + config.SERVICE_FORGET_PASSWORD,
      );

      setLoading(false);

      if (res?.status === "success") {
        setTimer(RESEND_TIME);
        setCanResend(false);
        setOtp(Array(OTP_LENGTH).fill(""));
      } else {
        setErrorMessage(res?.message || "Failed to resend OTP");
      }
    } catch {
      setLoading(false);
      setErrorMessage("Network error");
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
        sessionStorage.setItem("reset_email", email);
        sessionStorage.setItem("reset_otp", otpValue);
        navigate("/change-password", {
          state: {
            email,
            otp: otpValue,
          },
        });
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

      <Typography variant="body2" align="center" color="text.secondary" mb={6}>
        Didn’t receive the code?{" "}
        {canResend ? (
          <Link
            component="button"
            underline="none"
            color="primary.main"
            onClick={handleResend}
            sx={{ fontWeight: 600 }}
          >
            Resend Code
          </Link>
        ) : (
          <Typography style={{ color: "#999" }}>
            Resend in {formatTime(timer)}
          </Typography>
        )}
      </Typography>

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
