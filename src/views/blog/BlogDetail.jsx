import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SendIcon from "@mui/icons-material/Send";
import PageHeader from "../../layouts/main/components/PageHeader";
import BlogCreateDialog from "./BlogCreateDialog";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const config = new Configuration();
const dataService = new DataServices();

const COMMENT_LIMIT = 10;

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [openCreate, setOpenCreate] = useState(false);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchComments = useCallback(async (blogId, cursorParam = null) => {
    if (isFetchingRef.current || !blogId) return;
    isFetchingRef.current = true;
    if (cursorParam !== null) setCommentLoading(true);
    try {
      let serviceAction = `blogs/${blogId}/comments?limit=${COMMENT_LIMIT}`;
      if (cursorParam) serviceAction += `&cursor=${cursorParam}`;

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success" && Array.isArray(res.data)) {
        setComments((prev) =>
          cursorParam === null ? res.data : [...prev, ...res.data],
        );
        const nextCursor = res.pagination?.nextCursor ?? null;
        setCursor(nextCursor);
        setHasMore(!!(nextCursor && res.pagination?.hasNextPage));
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setCommentLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setPageLoading(true);
      try {
        const res = await dataService.retrieve(
          config.SERVICE_NAME,
          `blogs/${slug}`,
        );
        if (res?.status === "success") {
          setBlog(res.data);
          await fetchComments(res.data.id, null);
        }
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchAll();
  }, [slug, fetchComments]);

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          fetchComments(blog?.id, cursor);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, hasMore, fetchComments, blog?.id]);

  const handleSubmitComment = async () => {
    const userId = sessionStorage.getItem("userId");

    if (!commentText.trim() || !blog?.id) return;
    setSubmitting(true);
    try {
      const res = await dataService.retrievePOST(
        { content: commentText, userId },
        `${config.SERVICE_NAME}blogs/${blog.id}/comments`,
      );
      if (res?.status === "success") {
        setCommentText("");
        setComments((prev) => [res.data, ...prev]);
        setBlog((prev) => ({
          ...prev,
          _count: { comments: (prev._count?.comments ?? 0) + 1 },
        }));
      }
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderMedia = () => {
    if (!blog?.assetUrl) return null;
    if (blog.assetType === "VIDEO") {
      return (
        <video
          src={blog.assetUrl}
          controls
          style={{
            width: "100%",
            maxHeight: "400px",
            borderRadius: "15px",
            objectFit: "cover",
          }}
        />
      );
    }
    return (
      <img
        src={blog.assetUrl}
        alt={blog.title}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "15px",
        }}
      />
    );
  };

  return (
    <Box>
      <PageHeader
        title="Blogs"
        subtitle="Share thoughts, reflections, and insights"
        buttonText="New Post"
        onButtonClick={() => setOpenCreate(true)}
      />

      <Card sx={{ p: 2, border: "1px solid #E0E0E0" }}>
        <Box component="section" sx={{ p: 2 }}>
          <IconButton
            size="medium"
            sx={{ marginBottom: 2 }}
            onClick={() => navigate("/admin/blog")}
          >
            <KeyboardBackspaceIcon fontSize="inherit" />
          </IconButton>

          {pageLoading ? (
            <Skeleton variant="text" width={160} height={32} />
          ) : (
            <Typography variant="h5" gutterBottom>
              {blog?.user?.name ?? "Unknown"}
            </Typography>
          )}

          {pageLoading ? (
            <Skeleton variant="text" width={140} height={24} />
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
              {blog?.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </Typography>
          )}

          <Stack direction="column" gap={2} sx={{ marginTop: 4 }}>
            {pageLoading ? (
              <Skeleton variant="text" width="80%" height={32} />
            ) : (
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {blog?.title}
              </Typography>
            )}

            {pageLoading ? (
              <Skeleton variant="rounded" width="100%" height={300} />
            ) : (
              renderMedia()
            )}

            {pageLoading ? (
              <>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
              </>
            ) : (
              <Typography variant="body1" gutterBottom>
                {blog?.content}
              </Typography>
            )}

            {!pageLoading && blog?.tags?.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {blog.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.title}
                    variant="outlined"
                    sx={{ borderRadius: "6px" }}
                  />
                ))}
              </Box>
            )}

            <Divider />

            {pageLoading ? (
              <Skeleton variant="text" width={160} height={28} />
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
                Comments ({blog?._count?.comments ?? 0})
              </Typography>
            )}

            {pageLoading ? (
              <Stack spacing={2}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    width="100%"
                    height={90}
                  />
                ))}
              </Stack>
            ) : comments.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "35px 0",
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 45 }} />
                <Typography variant="body1" gutterBottom>
                  No comments yet
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Be the first to comment
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {comments.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      backgroundColor: "background.switch",
                      borderRadius: "12px",
                      p: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.muted"
                      >
                        {comment.user?.name ?? "Unknown"}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        color="text.muted"
                      >
                        {new Date(comment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body1" gutterBottom marginTop={2}>
                      {comment.content}
                    </Typography>
                  </Box>
                ))}

                {commentLoading && (
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                )}

                <Box ref={observerRef} sx={{ height: 1 }} />
              </Stack>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "background.switch",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                      borderRadius: "12px",
                    },
                  },
                }}
              />
              <Button
                variant="outlined"
                size="medium"
                disabled={submitting || !commentText.trim()}
                onClick={handleSubmitComment}
                sx={{
                  height: "65px",
                  width: "65px",
                  borderRadius: "12px",
                  backgroundColor: "#e8eaf6",
                  border: "none",
                  "&:hover": {
                    boxShadow: "0px 5px 6px rgba(0, 0, 0, .10)",
                  },
                }}
              >
                {submitting ? (
                  <CircularProgress size={20} />
                ) : (
                  <SendIcon fontSize="large" />
                )}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Card>

      <BlogCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </Box>
  );
};

export default BlogDetail;
