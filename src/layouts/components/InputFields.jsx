import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const InputField = ({ icon: Icon, type = "text", placeholder, ...props }) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      type={isPassword && showPassword ? "text" : type}
      placeholder={placeholder}
      margin="normal"
      variant="outlined"
      InputProps={{
        startAdornment: Icon ? (
          <InputAdornment position="start">
            <Icon fontSize="small" />
          </InputAdornment>
        ) : null,

        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOffOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "5px",
          backgroundColor: "background.paper",

          "& fieldset": {
            borderColor: "text.input",
          },

          "&:hover fieldset": {
            borderColor: "primary.light",
          },

          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: 1,
          },
        },

        "& input::placeholder": {
          color: "text.secondary",
          opacity: 1,
        },
      }}
      {...props}
    />
  );
};

export default InputField;
