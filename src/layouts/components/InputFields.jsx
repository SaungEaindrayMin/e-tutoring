import { TextField, InputAdornment } from "@mui/material";

const InputField = ({ icon: Icon, type = "text", placeholder, ...props }) => {
  return (
    <TextField
      fullWidth
      type={type}
      placeholder={placeholder}
      margin="normal"
      variant="outlined"
      InputProps={{
        startAdornment: Icon ? (
          <InputAdornment position="start">
            <Icon fontSize="small" />
          </InputAdornment>
        ) : null,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "5px",
          backgroundColor: "background.paper",
          transition: "all 0.2s ease",

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
