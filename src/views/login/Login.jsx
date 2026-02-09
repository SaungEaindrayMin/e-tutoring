import { Box, Typography, Button, Link } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthContainer from "../../layouts/components/AuthContainer";
import icon from "../../assets/images/icon.svg";
import InputField from "../../layouts/components/InputFields";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/forget-password");
  };

  return (
    <AuthContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 54,
            height: 54,
          }}
        >
          <img
            src={icon}
            alt="eTutor logo"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>

      <Typography variant="h2" align="center" gutterBottom color="primary.main">
        eTutor System
      </Typography>

      <Typography variant="body2" align="center" color="text.secondary" mb={3}>
        University Personal Tutoring Platform
      </Typography>

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          University Email
        </Typography>
        <InputField
          icon={EmailOutlinedIcon}
          placeholder="name@university.edu"
          required
          inputProps={{
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          }}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          Password
        </Typography>
        <InputField
          icon={LockOutlinedIcon}
          type="password"
          placeholder="Enter your password"
          required
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
        Login to Dashboard
      </Button>

      <Box textAlign="center" mt={0.5}>
        <Link href="#" underline="hover" variant="body2">
          <Typography onClick={handleNavigation}>
            Forgot your password?
          </Typography>
        </Link>
      </Box>

      <Typography
        variant="body2"
        align="center"
        color="text.muted"
        mt={3}
        paddingX={3}
      >
        By signing in, you agree to our{" "}
        <Link href="#" color="text.muted">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" color="text.muted">
          Privacy Policy
        </Link>
      </Typography>
    </AuthContainer>
  );
};

export default Login;
