import { Box, Button, Link, TextField, Typography } from "@mui/material";
import AuthContainer from "../../layouts/components/AuthContainer";
import icon from "../../assets/images/otp.svg";
import { useRef, useState } from "react";
import InputField from "../../layouts/components/InputFields";

const OTP_LENGTH = 6;

const OtpVerify = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const inputsRef = useRef([]);

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

  const handleVerify = () => {
    setVerificationAttempted(true);
    if (!otpValid) return;

    console.log("OTP verified:", otpValue);
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
        Please enter the 6-digit code sent to your email address.
      </Typography>

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
              style: {
                textAlign: "center",
                fontSize: 16,
              },
            }}
            error={verificationAttempted && !otpValid}
          />
        ))}
      </Box>

      <Typography variant="body2" align="center" color="text.secondary" mb={6}>
        Didn’t receive the code?{" "}
        <Link underline="none" href="#" color="primary.main">
          Resend
        </Link>
      </Typography>

      <Button
        fullWidth
        size="large"
        onClick={handleVerify}
        sx={{
          bgcolor: "primary.main",
          color: "background.paper",
          ":hover": { bgcolor: "primary.light" },
        }}
      >
        Verify Code
      </Button>
    </AuthContainer>
  );
};

export default OtpVerify;
