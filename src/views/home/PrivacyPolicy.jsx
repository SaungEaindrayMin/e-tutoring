import { Box, Container, Typography, Chip, Divider } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";
const GRADIENT_SOFT =
  "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(96,165,250,0.10) 50%, rgba(0,106,181,0.08) 100%)";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Personal identification information (name, email address, phone number) when you register for an account.",
      "Profile information such as your role (student, tutor, admin), academic details, and profile photo.",
      "Usage data including pages visited, features used, session duration, and interaction logs.",
      "Device and technical data such as IP address, browser type, operating system, and cookies.",
      "Communication data including messages exchanged between tutors and students on our platform.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To create and manage your account and provide access to eTutoring platform features.",
      "To match students with suitable tutors based on academic requirements and preferences.",
      "To facilitate live tutoring sessions, scheduling, and in-platform communications.",
      "To send notifications about session reminders, platform updates, and administrative messages.",
      "To analyse platform usage and improve our services, features, and user experience.",
      "To comply with legal obligations and enforce our Terms of Service.",
    ],
  },
  {
    title: "3. How We Share Your Information",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share your data with tutors or students as necessary to provide the tutoring service you have requested.",
      "We may share data with trusted third-party service providers (e.g. hosting, analytics) who operate under strict confidentiality obligations.",
      "We may disclose information when required by law, court order, or governmental authority.",
      "In the event of a merger or acquisition, your data may be transferred to the successor entity, with prior notice provided.",
    ],
  },
  {
    title: "4. Cookies & Tracking Technologies",
    content: [
      "We use cookies and similar tracking technologies to enhance your experience on our platform.",
      "Essential cookies are required for the platform to function correctly and cannot be disabled.",
      "Analytics cookies help us understand how users interact with eTutoring and are used to improve our services.",
      "You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We implement industry-standard security measures including encryption, secure HTTPS connections, and access controls.",
      "Your passwords are hashed and never stored in plain text.",
      "Access to personal data is restricted to authorised personnel only on a need-to-know basis.",
      "While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your personal data for as long as your account remains active or as needed to provide our services.",
      "You may request deletion of your account and associated data by contacting our support team.",
      "Some data may be retained for a limited period after account deletion to comply with legal obligations or resolve disputes.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "You have the right to access the personal information we hold about you.",
      "You may request correction of inaccurate or incomplete data in your profile.",
      "You have the right to request deletion of your personal data, subject to legal retention requirements.",
      "You may object to or restrict certain processing of your personal data.",
      "You have the right to data portability — to receive your data in a structured, machine-readable format.",
      "To exercise any of these rights, please contact us at privacy@etutoring.ac.uk.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "eTutoring is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.",
      "If you believe that a child has provided us with personal information, please contact us immediately so we can take appropriate action.",
    ],
  },
  {
    title: "9. Third-Party Links",
    content: [
      "Our platform may contain links to external websites or resources. We are not responsible for the privacy practices of those third-party sites.",
      "We encourage you to review the privacy policies of any third-party sites you visit.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law.",
      "We will notify you of significant changes by email or through a prominent notice on our platform.",
      "Your continued use of eTutoring after changes are posted constitutes your acceptance of the updated policy.",
    ],
  },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFBFF" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          textAlign: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: GRADIENT_SOFT,
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.10)",
            filter: "blur(80px)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.10)",
            filter: "blur(80px)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            icon={<LockOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Your Privacy Matters"
            size="small"
            sx={{
              mb: 3,
              px: 1.5,
              background: "rgba(124,58,237,0.10)",
              color: "#7C3AED",
              fontWeight: 600,
              fontSize: "0.78rem",
              border: "1px solid rgba(124,58,237,0.20)",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 3,
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "#475569",
              maxWidth: 580,
              mx: "auto",
              lineHeight: 1.75,
            }}
          >
            We are committed to protecting your personal information and your
            right to privacy. This policy explains what data we collect, how we
            use it, and the choices you have.
          </Typography>

          <Typography sx={{ mt: 3, fontSize: "0.85rem", color: "#94A3B8" }}>
            Last updated: 2 April 2026
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        {sections.map((section, idx) => (
          <Box key={idx} mb={5}>
            <Typography
              sx={{
                fontSize: { xs: "1.15rem", md: "1.3rem" },
                fontWeight: 700,
                mb: 2,
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {section.title}
            </Typography>

            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid rgba(124,58,237,0.12)",
                borderRadius: 2,
                p: { xs: 2.5, md: 3 },
                boxShadow: "0 2px 12px rgba(124,58,237,0.05)",
              }}
            >
              {section.content.map((point, pIdx) => (
                <Box
                  key={pIdx}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    mb: pIdx < section.content.length - 1 ? 1.75 : 0,
                  }}
                >
                  <Box
                    sx={{
                      mt: 0.55,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: GRADIENT,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: "#475569",
                      lineHeight: 1.7,
                    }}
                  >
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>

            {idx < sections.length - 1 && (
              <Divider sx={{ mt: 4, borderColor: "rgba(124,58,237,0.08)" }} />
            )}
          </Box>
        ))}

        <Box
          sx={{
            mt: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            background: GRADIENT_SOFT,
            border: "1px solid rgba(124,58,237,0.15)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Questions about your privacy?
          </Typography>
          <Typography
            sx={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.7 }}
          >
            Contact our Data Protection Officer at{" "}
            <Box
              component="a"
              href="mailto:privacy@etutoring.ac.uk"
              sx={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}
            >
              admin@etutoring.ac.uk
            </Box>{" "}
            or write to us at eTutoring Ltd, University Campus, London, UK.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
