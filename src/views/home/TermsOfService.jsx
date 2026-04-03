import { Box, Container, Typography, Chip, Divider } from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import { useNavigate } from "react-router-dom";

const GRADIENT =
  "linear-gradient(135deg, #7C3AED 0%, #60A5FA 40%, #2563EB 70%, #006AB5 100%)";
const GRADIENT_SOFT =
  "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(96,165,250,0.10) 50%, rgba(0,106,181,0.08) 100%)";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the eTutoring platform, you confirm that you have read, understood, and agree to be bound by these Terms of Service.",
      "If you are using eTutoring on behalf of an institution or organisation, you represent that you have authority to bind that entity to these terms.",
      "If you do not agree with any part of these terms, you must not use our platform.",
      "We reserve the right to update or modify these terms at any time. Continued use of the platform following any changes constitutes your acceptance of the revised terms.",
    ],
  },
  {
    title: "2. Eligibility & Accounts",
    content: [
      "You must be at least 13 years of age to use eTutoring. Users under 18 require parental or guardian consent.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
      "You must provide accurate, current, and complete information when creating your account.",
      "You may not share your account with any other person or use another user's account without their express permission.",
      "You must notify us immediately if you suspect any unauthorised use of your account at support@etutoring.ac.uk.",
    ],
  },
  {
    title: "3. Use of the Platform",
    content: [
      "eTutoring is intended solely for lawful educational purposes, including tutoring sessions, academic communication, and learning management.",
      "You agree not to use the platform to upload, share, or transmit any content that is unlawful, harmful, defamatory, obscene, or otherwise objectionable.",
      "You must not attempt to gain unauthorised access to any part of the platform, other accounts, or our systems.",
      "You may not use automated bots, scrapers, or other tools to access or interact with the platform without prior written consent.",
      "Impersonating another person, tutor, student, or administrator is strictly prohibited.",
      "Commercial use of the platform, including advertising or soliciting users for other services, is not permitted without explicit authorisation.",
    ],
  },
  {
    title: "4. Tutor & Student Responsibilities",
    content: [
      "Tutors are responsible for the accuracy and quality of the academic guidance they provide through the platform.",
      "Tutors must maintain professional conduct at all times and adhere to the academic standards set by the institution.",
      "Students are expected to engage respectfully and honestly in all interactions with tutors and platform staff.",
      "Both tutors and students must respect intellectual property rights and must not share copyrighted material without proper authorisation.",
      "Any disputes between tutors and students should be reported to the platform administrators for mediation.",
    ],
  },
  {
    title: "5. Intellectual Property",
    content: [
      "All content, features, and functionality on eTutoring — including text, graphics, logos, and software — are the exclusive property of eTutoring Ltd and are protected by applicable intellectual property laws.",
      "You retain ownership of any content you create and submit through the platform, but you grant eTutoring a non-exclusive, royalty-free licence to use, store, and display that content to operate the service.",
      "You must not copy, reproduce, modify, distribute, or create derivative works from any platform content without our prior written consent.",
    ],
  },
  {
    title: "6. Privacy",
    content: [
      "Your use of eTutoring is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.",
      "By using the platform, you consent to the collection and use of your information as described in our Privacy Policy.",
      "We take the protection of your data seriously and implement appropriate technical and organisational measures to safeguard it.",
    ],
  },
  {
    title: "7. Session Recording & Communications",
    content: [
      "Tutoring sessions may be recorded for quality assurance, safeguarding, and academic review purposes. You will be notified before any recording begins.",
      "All communications on the platform must remain professional and relevant to academic matters.",
      "eTutoring reserves the right to review platform communications where there is a concern about safety, misconduct, or policy violation.",
    ],
  },
  {
    title: "8. Termination",
    content: [
      "We reserve the right to suspend or terminate your account at any time if you violate these Terms of Service or engage in conduct that threatens the safety or integrity of the platform.",
      "You may terminate your account at any time by contacting our support team. Termination does not release you from obligations incurred prior to termination.",
      "Upon termination, your right to access the platform ceases immediately. We may retain certain data as required by law or our Privacy Policy.",
    ],
  },
  {
    title: "9. Disclaimers & Limitation of Liability",
    content: [
      "eTutoring is provided on an 'as is' and 'as available' basis without any warranties of any kind, express or implied.",
      "We do not guarantee that the platform will be error-free, uninterrupted, or free from viruses or other harmful components.",
      "To the fullest extent permitted by law, eTutoring Ltd shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the platform.",
      "Our total liability to you for any claims arising from use of the platform shall not exceed the amount paid by you, if any, in the preceding twelve months.",
    ],
  },
  {
    title: "10. Governing Law",
    content: [
      "These Terms of Service shall be governed by and construed in accordance with the laws of England and Wales.",
      "Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
      "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have any questions, concerns, or feedback about these Terms of Service, please contact us at legal@etutoring.ac.uk.",
      "For general support enquiries, visit our help centre or email support@etutoring.ac.uk.",
      "Our support team is available Monday to Friday, 9:00 AM – 5:00 PM (GMT).",
    ],
  },
];

const TermsOfService = () => {
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
            icon={<GavelOutlinedIcon sx={{ fontSize: 16 }} />}
            label="Please Read Carefully"
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
            Terms of Service
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
            These terms govern your use of the eTutoring platform. By accessing
            our services, you agree to the following terms and conditions in
            full. Please read them carefully before proceeding.
          </Typography>

          <Typography
            sx={{ mt: 3, fontSize: "0.85rem", color: "#94A3B8" }}
          >
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
            Have a legal question?
          </Typography>
          <Typography
            sx={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.7 }}
          >
            Reach our legal team at{" "}
            <Box
              component="a"
              href="mailto:legal@etutoring.ac.uk"
              sx={{
                color: "#7C3AED",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              admin@etutoring.ac.uk
            </Box>
            . By continuing to use eTutoring, you acknowledge that you have
            read and agree to these Terms of Service.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsOfService;