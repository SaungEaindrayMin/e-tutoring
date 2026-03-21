import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StatsCard from "../../../layouts/main/components/StatsCard";
const LEFT_COL = { xs: "1 1 100%", md: "1 1 0" };
const RIGHT_COL = { xs: "1 1 100%", md: "0 0 560px" };

const ProgressRow = ({ label, value }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>{value}%</Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{ mt: 1, height: 6, borderRadius: 1 }}
    />
  </Box>
);

const Dashboard = () => {
  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(25% - 12px)" }}>
          <StatsCard
            title="Upcoming Meetings"
            value="2"
            icon={<CalendarTodayOutlinedIcon sx={{ color: "text.active" }} />}
            iconBg="primary.active"
          />
        </Box>

        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(25% - 12px)" }}>
          <StatsCard
            title="Unread Messages"
            value="0"
            icon={
              <ChatBubbleOutlineOutlinedIcon sx={{ color: "text.message" }} />
            }
            iconBg="icon.message"
          />
        </Box>

        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(25% - 12px)" }}>
          <StatsCard
            title="Documents"
            value="2"
            icon={<DescriptionOutlinedIcon sx={{ color: "text.document" }} />}
            iconBg="icon.document"
          />
        </Box>

        <Box flex={{ xs: "1 1 100%", md: "1 1 calc(25% - 12px)" }}>
          <StatsCard
            title="Meeting Hours"
            value="12"
            icon={<AccessTimeOutlinedIcon sx={{ color: "text.meeting" }} />}
            iconBg="icon.meeting"
          />
        </Box>
      </Stack>

      <Stack Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
        <Box flex={LEFT_COL}>
          <Card sx={{ borderRadius: 1, height: "100%" }}>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Your Personal Tutor
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 72, height: 72, fontSize: 28 }}>
                  DSB
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Dr. Sarah Brown
                  </Typography>
                  <Typography color="text.secondary">
                    Computer Science
                  </Typography>
                  <Chip
                    label="T001"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "icon.document",
                      color: "text.document",
                    }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<ChatBubbleOutlineOutlinedIcon />}
                  sx={{ borderRadius: 1, py: 1.4 }}
                >
                  Send Message
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CalendarTodayOutlinedIcon />}
                  sx={{ borderRadius: 1, py: 1.4 }}
                >
                  Schedule Meetings
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box flex={RIGHT_COL}>
          <Card sx={{ borderRadius: 1, height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography fontWeight={600}>Upcoming Meetings</Typography>
                <Typography variant="body2">View All</Typography>
              </Stack>

              <Card variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: "primary.active" }}>
                      <CalendarTodayOutlinedIcon />
                    </Avatar>

                    <Box flex={1}>
                      <Typography fontWeight={600}>
                        Academic Progress Review
                      </Typography>
                      <Typography color="text.secondary">
                        Feb 9, 2026 · 2:00 PM
                      </Typography>
                    </Box>

                    <Chip label="Virtual" />
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: "primary.active" }}>
                      <CalendarTodayOutlinedIcon />
                    </Avatar>

                    <Box flex={1}>
                      <Typography fontWeight={600}>
                        Career Planning Discussion
                      </Typography>
                      <Typography color="text.secondary">
                        Feb 8, 2026 · 2:00 PM
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnOutlinedIcon fontSize="small" />
                        <Typography variant="body2">Office B204</Typography>
                      </Stack>
                    </Box>

                    <Chip label="In-Person" />
                  </Stack>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
        <Box flex={LEFT_COL}>
          <Card sx={{ borderRadius: 1, height: "100%" }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography fontWeight={600}>Recent Messages</Typography>
                <Typography variant="body2">View All</Typography>
              </Stack>

              <Card variant="outlined" sx={{ borderRadius: 1 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={600}>Dr. Sarah Brown</Typography>
                      <Typography color="text.secondary">Feb 07</Typography>
                    </Stack>

                    <Typography color="text.secondary">
                      Hi! I reviewed your recent assignment. Great work on the
                      project structure.
                    </Typography>

                    <Chip
                      label="New"
                      size="small"
                      color="primary"
                      sx={{ width: "fit-content" }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </Box>

        <Box flex={RIGHT_COL}>
          <Card sx={{ borderRadius: 1 }}>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Academic Progress
              </Typography>
              <Typography color="text.secondary" mb={3}>
                Your progress this semester
              </Typography>

              <Stack spacing={3}>
                <ProgressRow label="Meeting Attendance" value={85} />
                <ProgressRow label="Assignment Completion" value={92} />
                <ProgressRow label="Engagement Score" value={78} />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={600}>Overall Performance</Typography>
                <Chip label="On Track" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
