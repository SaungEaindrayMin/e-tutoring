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
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setErrorMessage("");

    const param = {
      email: email,
      password: password,
    };

    try {
      const response = await dataService.authorize(param, config.SERVICE_NAME + config.SERVICE_USER);
      setLoading(false);

      if (response?.status === "success" && response.token) {
        Cookies.set(config.COOKIE_NAME_TOKEN, response.token, { path: "/" });
        Cookies.set(config.COOKIE_NAME_USER, JSON.stringify(response.user), { path: "/" });
        sessionStorage.setItem(config.COOKIE_NAME_TOKEN, response.token);
        sessionStorage.setItem(config.COOKIE_NAME_USER, JSON.stringify(response.user));

        navigate("/admin");
      } else {
        setErrorMessage(response?.message || "Invalid email or password");
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage("Network error: Cannot connect to server");
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box mb={3}>
        <Typography variant="body2" fontWeight={600}>
          University Email
        </Typography>
        <InputField
          icon={EmailOutlinedIcon}
          placeholder="name@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Link component="button" onClick={handleNavigation} variant="body2">
          Forgot your password?
        </Link>
      </Box>
    </AuthContainer>
  );
};

export default Login;
