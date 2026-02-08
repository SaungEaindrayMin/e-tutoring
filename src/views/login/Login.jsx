import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Link,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthContainer from "../../layouts/components/AuthContainer";
import icon from "../../assets/images/icon.svg";
import InputField from "../../layouts/components/InputFields";

const Login = () => {
  return (
    <AuthContainer>
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 },
          }}
        >
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

          <Typography
            variant="h2"
            align="center"
            gutterBottom
            color="primary.main"
          >
            eTutor System
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={3}
          >
            University Personal Tutoring Platform
          </Typography>

          <Typography variant="body2" fontWeight={500} color="text.primary">
            University Email
          </Typography>
          <InputField
            icon={EmailOutlinedIcon}
            placeholder="staff@university.edu"
          />
          <Typography variant="body2" fontWeight={500} color="text.primary">
            Password
          </Typography>
          <InputField
            icon={LockOutlinedIcon}
            type="password"
            placeholder="Enter your password"
          />

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
              Forgot your password?
            </Link>
          </Box>

          <Typography variant="body2" align="center" color="text.muted" mt={3}>
            By signing in, you agree to our{" "}
            <Link href="#" color="text.muted">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" color="text.muted">
              Privacy Policy
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthContainer>
  );
};

export default Login;
