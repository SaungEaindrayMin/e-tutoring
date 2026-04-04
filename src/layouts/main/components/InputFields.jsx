import { TextField, InputAdornment, IconButton } from "@mui/material";
import { useState, forwardRef } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const InputField = forwardRef(
  (
    {
      icon: Icon,
      type = "text",
      placeholder,
      otp = false,
      sx,
      select = false, 
      children,
      ...props
    },
    ref,
  ) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextField
        ref={ref}
        select={select}
        fullWidth={!otp}
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        margin={otp ? "none" : "normal"}
        variant="outlined"
        InputProps={{
          startAdornment:
            Icon && !otp && !select ? (
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
            borderRadius: 0.5,

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "text.input",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: "2px",
            },

            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "error.main",
            },
          },

          "& .MuiInputBase-input::placeholder": {
            color: "text.secondary",
            opacity: 1,
          },

          ...sx,
        }}
        {...props}
      >
        {children}
      </TextField>
    );
  },
);

export default InputField;
