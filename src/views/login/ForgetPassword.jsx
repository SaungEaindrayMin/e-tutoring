import { Box, Button, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";
import AuthContainer from "../../layouts/components/AuthContainer";
import InputField from "../../layouts/components/InputFields";
import icon from "../../assets/images/forgotpassword.svg";

const ForgetPassword = () => {
  const navigate = useNavigate();

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

      <Typography variant="h2" align="center" gutterBottom color="primary.main">
        Forgot Password
      </Typography>

      <Typography variant="body2" align="center" color="text.secondary" mb={3}>
        Enter the email associated with your account and we’ll send instructions
        to reset your password.
      </Typography>

      <Box mb={3}>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          Email address
        </Typography>

        <InputField
          icon={EmailOutlinedIcon}
          type="email"
          placeholder="name@university.edu"
          required
          inputProps={{
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          }}
        />
      </Box>

      <Button
        fullWidth
        size="large"
        sx={{
          mt: 3,
          bgcolor: "primary.main",
          color: "background.paper",
          ":hover": {
            bgcolor: "primary.light",
          },
        }}
      >
        Send Instructions
      </Button>
    </AuthContainer>
  );
};

export default ForgetPassword;
