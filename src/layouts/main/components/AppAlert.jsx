import { Snackbar, Alert } from "@mui/material";

const AppAlert = ({
  open,
  message,
  severity = "success",
  onClose,
  autoHideDuration = 3000,
  position = { vertical: "top", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AppAlert;
