import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Hero from "./Hero";
import StatsBar from "./StatsBar";
import Features from "./Features";
import WhyChooseUs from "./WhyChooseUs";
import CTA from "./CTA";
import { useEffect, useState } from "react";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";

const Home = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: showNav ? "translate(-50%, 0)" : "translate(-50%, -120%)",
          transition: "all 0.35s ease",
          zIndex: 1000,

          width: "fit-content",
          minWidth: { xs: "90%", md: "auto" },

          px: { xs: 2, md: 3 },
          py: 1.2,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,

          borderRadius: "999px",
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.6)",

          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              background: GRADIENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 6px 16px rgba(124,58,237,0.4)",
            }}
          >
            <SchoolIcon sx={{ fontSize: 18 }} />
          </Box>

          <Typography
            fontWeight={800}
            sx={{
              fontSize: "1rem",
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            eTutoring
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={goToLogin}
          size="small"
          sx={{
            px: 3,
            py: 0.8,
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.85rem",
            background: GRADIENT,
            boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 10px 25px rgba(124,58,237,0.5)",
            },
          }}
        >
          Sign In
        </Button>
      </Box>

      <Hero />
      <StatsBar />
      <Features />
      <WhyChooseUs />
      {/* <CTA /> */}

      <Box
        component="footer"
        sx={{
          mt: 10,
          px: { xs: 3, md: 8 },
          py: 5,
          background: "#fff",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* LEFT - LOGO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: GRADIENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(124,58,237,0.35)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 18 }} />
            </Box>

            <Typography
              fontWeight={800}
              sx={{
                fontSize: "1.1rem",
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              eTutoring
            </Typography>
          </Box>

          {/* CENTER - LINKS */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {["Privacy Policy", "Terms & Conditions", "Contact"].map((item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{
                  color: "#64748B",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "0.2s",
                  "&:hover": {
                    color: "#7C3AED",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* RIGHT - SOCIAL */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {[
              { icon: <FacebookIcon />, color: "#1877F2" },
              { icon: <TwitterIcon />, color: "#1DA1F2" },
              { icon: <InstagramIcon />, color: "#E1306C" },
              { icon: <LinkedInIcon />, color: "#0A66C2" },
            ].map((s, i) => (
              <Box
                key={i}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F8FAFC",
                  color: "#64748B",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background: s.color,
                    color: "#fff",
                    transform: "translateY(-3px)",
                    boxShadow: `0 10px 20px ${s.color}40`,
                  },
                }}
              >
                {s.icon}
              </Box>
            ))}
          </Box>
        </Box>

        {/* BOTTOM COPYRIGHT */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            © {new Date().getFullYear()} eTutoring Platform. All rights
            reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
