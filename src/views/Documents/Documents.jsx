import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import DocumentUploadDialog from "./DocumentUploadDialog";

const initialDocuments = [
  {
    id: 1,
    title: "Academic Progress Review",
    fileName: "assignment1.pdf",
    uploadedBy: "Zue",
    uploadedAt: "Feb 1, 2026",
    studentIds: [1, 2],
  },
  {
    id: 2,
    title: "Module 2 Reading Material",
    fileName: "module-2-notes.pdf",
    uploadedBy: "Hmu",
    uploadedAt: "Feb 2, 2026",
    studentIds: [3],
  },
  {
    id: 3,
    title: "Chapter 2 Notes",
    fileName: "chapter2-notes.pdf",
    uploadedBy: "You",
    uploadedAt: "Feb 3, 2026",
    studentIds: [1, 4],
  },
];

const DocumentsPage = () => {
  const [openUpload, setOpenUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState(initialDocuments);

  const filteredDocuments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return documents;

    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(keyword) ||
        doc.fileName.toLowerCase().includes(keyword) ||
        doc.uploadedBy.toLowerCase().includes(keyword)
    );
  }, [search, documents]);

  const handleOpenUpload = () => setOpenUpload(true);
  const handleCloseUpload = () => setOpenUpload(false);

  const handleUploadDocument = (payload) => {
    console.log("STEP 2 JSON DATA:", payload);

    // API BIND HERE

    const newDocument = {
      id: Date.now(),
      title: payload.title,
      fileName: payload.fileName || payload.file?.name || "unknown-file.pdf",
      uploadedBy: "You",
      uploadedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      studentIds: payload.studentIds || [],
      file: payload.file || null,
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setOpenUpload(false);
  };

  const handleDownload = (doc) => {
    // API BIND HERE

    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    alert(`Download clicked: ${doc.fileName}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Documents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share and manage documents with your tutor
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={handleOpenUpload}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            px: 3,
            py: 1.2,
            fontWeight: 700,
            boxShadow: "none",
          }}
        >
          Upload Document
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: 4,
          p: 3,
          minHeight: 300,
        }}
      >
        {documents.length === 0 ? (
          <Box
            sx={{
              minHeight: 240,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                bgcolor: "#EAF3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DescriptionOutlinedIcon sx={{ color: "#1976d2", fontSize: 32 }} />
            </Box>

            <Typography fontWeight={700} fontSize="1.6rem">
              No Document
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={3}>
              You haven’t uploaded any documents yet
            </Typography>

            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={handleOpenUpload}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Post Your First Document
            </Button>
          </Box>
        ) : filteredDocuments.length === 0 ? (
          <Box
            sx={{
              minHeight: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              No matching documents found.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 3,
              alignItems: "start",
            }}
          >
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid #EAEAEA",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "#F3E8FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <DescriptionOutlinedIcon sx={{ color: "#7E57C2" }} />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: "1rem",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {doc.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {doc.fileName}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Uploaded by {doc.uploadedBy}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.uploadedAt}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(doc)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "999px",
                      boxShadow: "none",
                      fontWeight: 700,
                      py: 1.2,
                    }}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <DocumentUploadDialog
        open={openUpload}
        onClose={handleCloseUpload}
        onUpload={handleUploadDocument}
      />
    </Box>
  );
};

export default DocumentsPage;
