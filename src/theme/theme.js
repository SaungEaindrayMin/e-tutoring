import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: {
    borderRadius: 12,
  },

  palette: {
    mode: "light",
    primary: {
      main: "#1686D7",
      light: "#60A5FA",
      dark: "#006AB5",
      active: "#e0f2fe",
    },

    secondary: {
      main: "#7C3AED",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
      switch: "#F5F5F5",
    },

    text: {
      primary: "#000000",
      secondary: "#9E9E9E",
      input: "#E0E0E0",
      muted: "#616161",
      active: "#2563eb",
      message: "#43A047",
      document: "#7E57C2",
      meeting: "#E65100",
      danger: "#F44336",
    },

    icon: {
      message: "#C8E6C9",
      document: "#EDE7F6",
      meeting: "#FBE9E7",
    },
    error: {
      main: "#EF4444",
    },
  },

  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",

    h1: { fontSize: "40px", fontWeight: 700 },
    h2: { fontSize: "32px", fontWeight: 700 },
    h3: { fontSize: "24px", fontWeight: 600 },
    body1: { fontSize: "16px" },
    body2: { fontSize: "14px" },
    body3: { fontSize: "11px" },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          borderRadius: "5px",
          padding: "10px 18px",
          boxShadow: "none",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

export default theme;
