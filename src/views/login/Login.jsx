import { Box, Typography, Button, Link, Alert } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthContainer from "../../layouts/main/components/AuthContainer";
import icon from "../../assets/images/icon.svg";
import InputField from "../../layouts/main/components/InputFields";
import { useNavigate } from "react-router-dom";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";
import Cookies from "js-cookie";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const config = new Configuration();
  const dataService = new DataServices();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNavigation = () => {
    navigate("/forget-password");
  };

  const handleSignIn = async () => {
    const newErrors = {};
    if (!email) newErrors.email = "Please fill your email !";
    if (!password) newErrors.password = "Please fill your password !";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setErrorMessage("");

    const param = {
      email: email,
      password: password,
    };

    try {
      const response = await dataService.authorize(
        param,
        config.SERVICE_NAME + config.SERVICE_USER,
      );
      setLoading(false);

      if (response?.status === "success" && response.token) {
        Cookies.set(config.COOKIE_NAME_TOKEN, response.token, { path: "/" });
        Cookies.set(config.COOKIE_NAME_USER, JSON.stringify(response.user), {
          path: "/",
        });
        sessionStorage.setItem(config.COOKIE_NAME_TOKEN, response.token);
        sessionStorage.setItem(
          config.COOKIE_NAME_USER,
          JSON.stringify(response.user),
        );

        sessionStorage.setItem("userRole", response.user.role);
        sessionStorage.setItem("userId", response.user.id);

        sessionStorage.setItem("userName", response.user.name);

        navigate("/admin");
      } else {
        setErrorMessage(response?.message || "Invalid email or password");
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Network error: Cannot connect to server");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSignIn();
    }
  };

  return (
    <AuthContainer>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box width={54} height={54}>
          <img src={icon} alt="logo" style={{ width: "100%" }} />
        </Box>
      </Box>

      <Typography variant="h2" align="center" gutterBottom color="primary.main">
        eTutor System
      </Typography>

      <Typography variant="body2" align="center" color="text.secondary" mb={3}>
        University Personal Tutoring Platform
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {errorMessage}
        </Alert>
      )}

      <Box mb={2}>
        <Typography variant="body2" fontWeight={600}>
          University Email
        </Typography>
        <InputField
          icon={EmailOutlinedIcon}
          placeholder="name@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600}>
          Password
        </Typography>
        <InputField
          icon={LockOutlinedIcon}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          error={!!errors.password}
          helperText={errors.password}
        />
      </Box>

      <Button
        fullWidth
        size="large"
        onClick={handleSignIn}
        disabled={loading}
        sx={{
          mt: 3,
          bgcolor: "primary.main",
          color: "background.paper",
          ":hover": { bgcolor: "primary.light" },
        }}
      >
        {loading ? "Signing in..." : "Login to Dashboard"}
      </Button>

      <Box textAlign="center" mt={1}>
        <Link
          component="button"
          onClick={handleNavigation}
          variant="body1"
          underline="none"
          color="primary.dark"
        >
          Forgot your password?
        </Link>
      </Box>

      <Box textAlign="center" mt={1} px={5}>
        <Typography variant="body3" color="text.muted">
          By signing in, you aggree to our{" "}
          <Link
            underline="always"
            sx={{
              cursor: "pointer",
              color: "text.muted",
              textDecoration: "underline",
              textDecorationColor: "text.muted",
            }}
          >
            Terms of Service
          </Link>
          and{" "}
          <Link
            underline="always"
            sx={{
              cursor: "pointer",
              color: "text.muted",
              textDecoration: "underline",
              textDecorationColor: "text.muted",
            }}
          >
            Privacy Policy
          </Link>
        </Typography>
      </Box>
    </AuthContainer>
  );
};

export default Login;
