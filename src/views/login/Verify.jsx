import AuthContainer from "../../layouts/components/AuthContainer";
import icon from "../../assets/images/verify.svg";
import { Box, Button, Typography } from "@mui/material";

const Verify = () => {
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
        Verified
      </Typography>

      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        mb={3}
        paddingX={5}
      >
        Your account has been verified successfully
      </Typography>
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
        Done
      </Button>
    </AuthContainer>
  );
};

export default Verify;
