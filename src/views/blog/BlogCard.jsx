import {
  Box,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useNavigate } from "react-router-dom";

const mediaStyle = {
  width: "100%",
  maxWidth: "235px",
  height: "210px",
  objectFit: "cover",
  borderRadius: "15px",
  display: "block",
};

const BlogCard = ({
  slug,
  author = "Unknown",
  date = "",
  title = "",
  image = "",
  assetType = null,
  description = "",
  tags = [],
  commentsCount = 0,
  loading = false,
}) => {
  const navigate = useNavigate();

  const renderMedia = () => {
    if (!image) return null;
    if (assetType === "VIDEO") {
      return <video src={image} controls style={mediaStyle} />;
    }
    return <img src={image} alt={title} style={mediaStyle} />;
  };

  return (
    <Card sx={{ p: 2, border: "1px solid #E0E0E0" }}>
      <Box component="section" sx={{ p: 2 }}>
        {loading ? (
          <Skeleton variant="text" width={120} height={32} />
        ) : (
          <Typography variant="h5" gutterBottom>
            {author}
          </Typography>
        )}

        {loading ? (
          <Skeleton variant="text" width={160} height={24} />
        ) : (
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.muted",
              fontWeight: "semibold",
            }}
          >
            <CalendarTodayIcon />
            {date}
          </Typography>
        )}

        <Stack direction="column" gap={2} sx={{ marginTop: 4 }}>
          {loading ? (
            <Skeleton variant="text" width="80%" height={32} />
          ) : (
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}

          {loading ? (
            <Skeleton variant="rounded" width={235} height={210} />
          ) : (
            renderMedia()
          )}

          {loading ? (
            <>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
            </>
          ) : (
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </Typography>
          )}

          {!loading && tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{ borderRadius: "6px" }}
                />
              ))}
            </Box>
          )}

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {loading ? (
              <Skeleton variant="text" width={120} height={32} />
            ) : (
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.muted",
                  fontWeight: "semibold",
                }}
              >
                <ChatBubbleOutlineIcon />
                Comments ({commentsCount})
              </Typography>
            )}

            {loading ? (
              <Skeleton variant="rounded" width={100} height={32} />
            ) : (
              <Button
                variant="text"
                endIcon={<ArrowRightAltIcon />}
                sx={{ color: "text.primary" }}
                onClick={() => navigate(`/admin/blog/${slug}`)}
              >
                Read More
              </Button>
            )}
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

export default BlogCard;
