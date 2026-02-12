import { Box, Button, Typography } from "@mui/material";
import AuthContainer from "../../layouts/main/components/AuthContainer";
import InputField from "../../layouts/main/components/InputFields";
import icon from "../../assets/images/newpassword.svg";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const ChangePassword = () => {
  return (
    <AuthContainer>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box width={72} height={72}>
          <img
            src={icon}
            alt="Forgot password"
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
        paddingX={5}
      >
        Your new password must be different from previous used passwords
      </Typography>

      <Box mb={3}>
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

      <Box>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          Confirm Password
        </Typography>
        <InputField
          icon={LockOutlinedIcon}
          type="password"
          placeholder="Enter your confirm password"
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
        Continue
      </Button>
    </AuthContainer>
  );
};

export default ChangePassword;
