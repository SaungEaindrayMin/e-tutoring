import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import PageHeader from "../../layouts/main/components/PageHeader";
import InputField from "../../layouts/main/components/InputFields";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BlogCard from "./BlogCard";
import { useState, useEffect, useRef, useCallback } from "react";
import BlogCreateDialog from "./BlogCreateDialog";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const config = new Configuration();
const dataService = new DataServices();

const LIMIT = 10;

const BlogList = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // for skeleton
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [totalBlogs, setTotalBlogs] = useState(0);

  const observerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const searchTimerRef = useRef(null);

  const fetchTags = async () => {
    try {
      const res = await dataService.retrieve(config.SERVICE_NAME, "tags");
      if (res?.status === "success" && Array.isArray(res.data)) {
        setTags(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch tags", err);
    }
  };

  const fetchBlogs = useCallback(
    async (cursorParam = null, title = searchTitle, tag = selectedTag) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        let serviceAction = `blogs/?limit=${LIMIT}`;
        if (cursorParam) serviceAction += `&cursor=${cursorParam}`;
        if (title) serviceAction += `&title=${encodeURIComponent(title)}`;
        if (tag) serviceAction += `&tag=${encodeURIComponent(tag)}`;

        const res = await dataService.retrieve(
          config.SERVICE_NAME,
          serviceAction,
        );

        if (res?.status === "success" && Array.isArray(res.data)) {
          setBlogs((prev) =>
            cursorParam === null ? res.data : [...prev, ...res.data],
          );

          const nextCursor = res.pagination?.nextCursor ?? null;
          setCursor(nextCursor);
          setHasMore(!!(nextCursor && res.pagination?.hasNextPage));
          setTotalBlogs(res.pagination?.totalBlogs ?? 0);
        } else {
          if (cursorParam === null) setBlogs([]);
          setHasMore(false);
          setTotalBlogs(0);
        }
      } catch (err) {
        console.error("Failed to fetch blogs", err);
        if (cursorParam === null) setBlogs([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        isFetchingRef.current = false;
      }
    },
    [searchTitle, selectedTag],
  );

  useEffect(() => {
    fetchBlogs(null);
    fetchTags();
  }, []);

  useEffect(() => {
    setCursor(null);
    setHasMore(true);
    fetchBlogs(null, searchTitle, selectedTag);
  }, [selectedTag]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTitle(value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setCursor(null);
      setHasMore(true);
      fetchBlogs(null, value, selectedTag);
    }, 500);
  };

  const handleTagClick = (tagTitle) => {
    setSelectedTag((prev) => (prev === tagTitle ? null : tagTitle));
  };

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          fetchBlogs(cursor);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, hasMore, fetchBlogs]);

  return (
    <Box sx={{ backgroundColor: "background.paper" }}>
      <PageHeader
        title="Blogs"
        subtitle="Share thoughts, reflections, and insights"
        buttonText="New Post"
        onButtonClick={() => setOpenCreate(true)}
      />

      <Grid container spacing={4}>
        {/* ── Sidebar ── */}
        <Grid size={{ xs: 12, md: 4 }} order={{ xs: 1 }}>
          <Stack spacing={4}>
            {/* Search */}
            <Card sx={{ p: 2, border: "1px solid #E0E0E0" }}>
              <Box component="section" sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Search
                </Typography>
                <InputField
                  placeholder="Search Title"
                  size="small"
                  icon={SearchIcon}
                  placeholderColor="text.secondary"
                  value={searchTitle}
                  onChange={handleSearchChange}
                />
              </Box>
            </Card>

            {/* Statistics */}
            <Card sx={{ p: 2, border: "1px solid #E0E0E0" }}>
              <Box component="section" sx={{ p: 2 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TrendingUpIcon />
                  Statistics
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "semibold", color: "text.muted" }}
                >
                  Total Posts
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ color: "text.danger" }}
                >
                  {totalBlogs}
                </Typography>
              </Box>
            </Card>

            {/* Tags */}
            <Card sx={{ p: 2, border: "1px solid #E0E0E0" }}>
              <Box component="section" sx={{ p: 2 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TrendingUpIcon />
                  Tags
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  {tags.map((tag) => {
                    const isActive = selectedTag === tag.title;
                    return (
                      <Chip
                        key={tag.id}
                        label={tag.title}
                        onClick={() => handleTagClick(tag.title)}
                        variant={isActive ? "filled" : "outlined"}
                        sx={{
                          borderRadius: "6px",
                          fontWeight: 600,
                          cursor: "pointer",
                          ...(isActive && {
                            bgcolor: "primary.active",
                            color: "primary.main",
                            borderColor: "primary.main",
                          }),
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Card>
          </Stack>
        </Grid>

        {/* ── Blog Feed ── */}
        <Grid size={{ xs: 12, md: 8 }} order={{ xs: 2 }}>
          <Stack spacing={3}>
            {/* Initial skeleton loading */}
            {initialLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <BlogCard key={i} loading />
                ))
              : blogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    slug={blog.slug}
                    author={blog.user?.name}
                    date={new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    title={blog.title}
                    image={blog.assetUrl}
                    assetType={blog.assetType}
                    description={blog.content}
                    tags={blog.tags?.map((t) => t.title) ?? []}
                    commentsCount={blog._count?.comments ?? 0}
                  />
                ))}

            {/* Load more spinner */}
            {!initialLoading && loading && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={28} />
              </Box>
            )}

            {/* End of list */}
            {!hasMore && blogs.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                py={2}
              >
                You've reached the end.
              </Typography>
            )}

            {/* Empty state */}
            {!initialLoading && !loading && blogs.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                py={4}
              >
                No blog posts found.
              </Typography>
            )}

            {/* Sentinel for IntersectionObserver */}
            <Box ref={observerRef} sx={{ height: 1 }} />
          </Stack>
        </Grid>
      </Grid>

      <BlogCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </Box>
  );
};

export default BlogList;
