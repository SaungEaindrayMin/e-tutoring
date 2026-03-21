import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";
import { useNavigate } from "react-router-dom";

const config = new Configuration();
const dataService = new DataServices();

const BlogCreateDialog = ({ open, onClose, onCreated }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("userId");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "video/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const dropped = acceptedFiles[0];
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
      setFileType(dropped.type.startsWith("video") ? "video" : "image");
    },
  });

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
    if (e.key === "Backspace" && tagInput === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
    setFile(null);
    setPreview(null);
    setFileType(null);
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!content.trim()) return setError("Content is required.");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("content", content);
      if (file) formData.append("file", file);
      tags.forEach((tag) => formData.append("tagIds[]", tag));

      const res = await dataService.retrievePOSTFormData(
        formData,
        `${config.SERVICE_NAME}blogs`,
      );

      if (res?.status === "success") {
        handleClose();
        onCreated?.();
        navigate(`/admin/blog/${res.data.slug}`);
      } else {
        setError(res?.message ?? "Failed to create blog.");
      }
    } catch (err) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="md">
      <Box p={2}>
        <Typography variant="h5" textAlign="left">
          Create New Blog
        </Typography>
        <Typography color="text.muted" mb={3}>
          Share your thoughts, experiences, and insights
        </Typography>

        <Stack spacing={2}>
          <InputField
            label="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Dropzone */}
          <Box
            {...getRootProps()}
            sx={{
              display: "flex",
              flexDirection: "column",
              border: `1px dashed ${isDragActive ? "#1686D7" : "#E0E0E0"}`,
              borderRadius: "10px",
              p: 2,
              cursor: "pointer",
              bgcolor: isDragActive ? "primary.active" : "background.paper",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "primary.active",
              },
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="body1" color="text.secondary">
              {isDragActive
                ? "Drop file here..."
                : "Drag & drop or select a file"}
            </Typography>
          </Box>

          {/* Preview */}
          {preview && (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              {fileType === "image" ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "235px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <video
                  src={preview}
                  controls
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              )}
              <IconButton
                onClick={handleRemoveFile}
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 200,
                  bgcolor: "rgba(0,0,0,0.4)",
                  color: "white",
                  width: 28,
                  height: 28,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Content *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Tags input */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
              border: "1px solid #E0E0E0",
              borderRadius: "10px",
              p: 2,
              minHeight: "45px",
            }}
          >
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDelete(tag)}
                sx={{ borderRadius: "6px" }}
              />
            ))}
            <TextField
              variant="standard"
              placeholder={
                tags.length === 0 ? "Tags (optional), separate by comma..." : ""
              }
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{ disableUnderline: true }}
              sx={{ flex: 1, minWidth: "150px" }}
            />
          </Box>

          {/* Error */}
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Stack>

        <Button
          fullWidth
          size="large"
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            mt: 3,
            bgcolor: "primary.main",
            color: "background.paper",
            ":hover": { bgcolor: "primary.light" },
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Create Blog"
          )}
        </Button>
      </Box>
    </CustomDialog>
  );
};

export default BlogCreateDialog;
