import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import InsightsIcon from "@mui/icons-material/Insights";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MessageIcon from "@mui/icons-material/Message";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useNavigate } from "react-router-dom";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";

const FEATURES = [
  {
    icon: <AssignmentIndIcon fontSize="large" />,
    title: "Tutor Allocation",
    desc: "Our system intelligently matches students with the most suitable tutors based on subject expertise and availability.",
  },
  {
    icon: <VideoCallIcon fontSize="large" />,
    title: "Schedule Meeting",
    desc: "Easily schedule sessions with tutors and manage your learning timeline with flexible schedule options.",
  },
  {
    icon: <MessageIcon fontSize="large" />,
    title: "Direct Messaging",
    desc: "Stay connected with instant messaging between students, tutors, and administrators for quick communication.",
  },
  {
    icon: <AutoStoriesIcon fontSize="large" />,
    title: "Upload Documents",
    desc: "Easily upload, manage, and share your learning materials with a streamlined document system.",
  },
  {
    icon: <InsightsIcon fontSize="large" />,
    title: "Progress Analytics",
    desc: "Track learning milestones and session history with insightful dashboards tailored for every role.",
  },
  {
    icon: <GroupsIcon fontSize="large" />,
    title: "Multi-Role Access",
    desc: "Purpose-built dashboards for Admins, Tutors, and Students — everyone gets exactly what they need.",
  },
];

const Features = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");

  return (
    <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#F8FAFC" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: "#7C3AED", fontWeight: 700, letterSpacing: 2 }}
          >
            Platform Features
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              mt: 1,
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              color: "#0F172A",
            }}
          >
            Everything You Need to Succeed
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748B", maxWidth: 520, mx: "auto" }}
          >
            A complete suite of tools designed to make e-tutoring effective,
            organised, and enjoyable.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              onClick={goToLogin}
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: "16px",
                p: 1,
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 40px rgba(37,99,235,0.12)",
                  borderColor: "rgba(124,58,237,0.25)",
                },

                "&:hover .feature-icon": {
                  background: GRADIENT,
                  color: "#fff",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 }, flexGrow: 1 }}>
                <Avatar
                  className="feature-icon"
                  sx={{
                    width: { xs: 44, md: 52 },
                    height: { xs: 44, md: 52 },
                    mb: 2,
                    background: "rgba(124,58,237,0.10)",
                    color: "#7C3AED",
                    borderRadius: "14px",
                    transition: "all 0.25s ease",
                  }}
                >
                  {f.icon}
                </Avatar>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 1, fontSize: { xs: "1rem", md: "1.1rem" } }}
                >
                  {f.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                  }}
                >
                  {f.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
