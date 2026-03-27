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
      analytics: "#7CC2FF",
      active: "#e0f2fe",
    },

    secondary: {
      main: "#7C3AED",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
      switch: "#F5F5F5",
      analytics: "#8C9EFF",
      blue: "#E3F2FD",
      green: "#E8F5E9",
      red: "#FFEBEE",
      yellow: "#FFF3E0",
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
      assign: "#2FAB30",
      analytics: "#005094",
      warning: "#F3AF39",
    },

    icon: {
      message: "#C8E6C9",
      document: "#EDE7F6",
      meeting: "#FBE9E7",
      assign: "#C3FFBF",
    },
    error: {
      main: "#EF4444",
    },

    chart: {
      purple: "#7C4DFF",
      pink: "#EA80FC",
      red: "#F06292",
      "deep-purple": "#B388FF",
      blue: "#03A9F4",
      yellow: "#F9A825",
      orange: "#FF8A65",
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
          borderRadius: "8px",
          padding: "10px 18px",
          color: "#fff",

          // 🎨 main gradient
          background:
            "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)",

          // ✨ color-matched shadow
          boxShadow: `
      0 4px 12px rgba(124,58,237,0.30),
      0 8px 24px rgba(37,99,235,0.25)
    `,

          textTransform: "none",
          fontWeight: 600,

          "&:hover": {
            background:
              "linear-gradient(135deg, #6D28D9 0%, #3B82F6 40%, #1D4ED8 70%, #005B9E 100%)",

            boxShadow: `
        0 6px 16px rgba(124,58,237,0.35),
        0 12px 32px rgba(37,99,235,0.30)
      `,
          },

          "&:active": {
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          },
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
