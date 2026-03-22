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
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import DocumentUploadDialog from "./DocumentUploadDialog";

const initialDocuments = [
  // {
  //   id: 1,
  //   title: "Academic Progress Review",
  //   fileName: "assignment1.pdf",
  //   uploadedBy: "Zue",
  //   uploadedAt: "Feb 1, 2026",
  //   studentIds: [1, 2],
  // },
  // {
  //   id: 2,
  //   title: "Module 2 Reading Material",
  //   fileName: "module-2-notes.pdf",
  //   uploadedBy: "Hmu",
  //   uploadedAt: "Feb 2, 2026",
  //   studentIds: [3],
  // },
  // {
  //   id: 3,
  //   title: "Chapter 2 Notes",
  //   fileName: "chapter2-notes.pdf",
  //   uploadedBy: "You",
  //   uploadedAt: "Feb 3, 2026",
  //   studentIds: [1, 4],
  // },
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
          <Typography variant="h3" fontWeight="bold">
            Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Share and manage documents with your students
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<FileUploadIcon />}
          onClick={handleOpenUpload}
          sx={{
            textTransform: "none",
            borderRadius: "6px",
            px: 3,
            py: 1,
            fontWeight: 600,
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

      {documents.length === 0 ? (
        <Box
          sx={{
            border: "1px solid",
            borderColor: "text.input",
            borderRadius: "8px",
            p: 3,
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                borderRadius: "12px",
                bgcolor: "primary.active",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                borderColor: "primary.light"
              }}
            >
              <CalendarTodayOutlinedIcon sx={{ color: "primary.main", fontSize: 32 }} />
            </Box>

            <Typography variant="body2" fontWeight={500} color="text.secondary" mb={2}>
              No Document
            </Typography>

            <Button
              variant="outlined"
              onClick={handleOpenUpload}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                fontWeight: 600,
                color: "text.primary",
                borderColor: "text.input",
                px: 3,
                py: 1,
                ":hover": {
                  borderColor: "text.secondary",
                  bgcolor: "background.switch"
                }
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
                  borderRadius: "8px",
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "text.input",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "8px",
                        bgcolor: "icon.document",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <DescriptionOutlinedIcon sx={{ color: "text.document" }} />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: "0.95rem",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 0.5
                        }}
                      >
                        {doc.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 2
                        }}
                      >
                        {doc.fileName}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: "background.switch",
                            px: 1.2,
                            py: 0.4,
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="caption" fontWeight={500} color="text.muted" sx={{ fontSize: "0.7rem" }}>
                            Uploaded by {doc.uploadedBy}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          {doc.uploadedAt}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(doc)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "6px",
                      boxShadow: "none",
                      fontWeight: 600,
                      py: 1,
                    }}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      <DocumentUploadDialog
        open={openUpload}
        onClose={handleCloseUpload}
        onUpload={handleUploadDocument}
      />
    </Box>
  );
};

export default DocumentsPage;
