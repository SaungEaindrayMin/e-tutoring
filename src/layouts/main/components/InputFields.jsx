import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useState, forwardRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const InputField = forwardRef(
  (
    { icon: Icon, type = "text", placeholder, otp = false, sx, ...props },
    ref,
  ) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextField
        ref={ref}
        fullWidth={!otp}
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        margin={otp ? "none" : "normal"}
        variant="outlined"
        InputProps={{
          startAdornment:
            Icon && !otp ? (
              <InputAdornment position="start">
                <Icon fontSize="small" />
              </InputAdornment>
            ) : null,

          endAdornment:
            isPassword && !otp ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                  ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "5px",
            backgroundColor: "background.paper",
          },
          ...sx,
        }}
        {...props}
      />
    );
  },
);

export default InputField;
