import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { IconButton } from "@mui/material";
import DocumentUploadDialog from "./DocumentUploadDialog";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const dataService = new DataServices();
const config = new Configuration();

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
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  
  const userRole = useMemo(() => sessionStorage.getItem("userRole")?.toLowerCase(), []);
  const isAdmin = userRole === "admin";
  
  const currentUserId = useMemo(() => {
    const userStr = Cookies.get(config.COOKIE_NAME_USER);
    let currentUser = null;
    try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
    return currentUser?.id || currentUser?.userId || null;
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const userStr = Cookies.get(config.COOKIE_NAME_USER);
      let currentUser = null;
      try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
      const currentUserId = currentUser?.id || currentUser?.userId || null;

      if (!currentUserId) {
        setLoading(false);
        return;
      }

      // First fetch the profile to get the specific IDs
      console.log("Fetching profile for user:", currentUserId);
      const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
      console.log("Profile response:", profileRes);
      
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "50");

      if (profileRes?.status === "success" && profileRes.data) {
        const fullProfile = profileRes.data;
        const role = sessionStorage.getItem("userRole")?.toLowerCase();
        console.log("Current role:", role);
        
        if (role === "tutor") {
          const tutorId = fullProfile.tutorProfile?.id;
          if (tutorId) {
            params.append("tutorId", tutorId);
            console.log("Added tutorId:", tutorId);
          }
        } else if (role === "student") {
          const studentId = fullProfile.studentProfile?.id;
          if (studentId) {
            params.append("studentId", studentId);
            console.log("Added studentId:", studentId);
          }
        }
      }

      const queryString = params.toString();
      const endpoint = `documents?${queryString}`;
      console.log("Final Fetch Endpoint:", endpoint);
      
      const response = await dataService.retrieve(config.SERVICE_NAME, endpoint);

      if (response && response.status === "success") {
        setDocuments(response.data || []);
      } else {
        console.error("Failed to load documents", response);
        // If it failed with a 400, maybe the parameters were wrong.
        // Let's try to fetch without extra params as a last resort.
        if (response?.status === 400 || !queryString) {
           console.log("Retrying without ID filters...");
           const retryResponse = await dataService.retrieve(config.SERVICE_NAME, "documents?page=1&limit=50");
           if (retryResponse?.status === "success") {
             setDocuments(retryResponse.data || []);
             return;
           }
        }
        setDocuments([]);
      }
    } catch (err) {
      console.error("Error in fetchDocuments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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

  const handleUploadDocument = async (payload) => {
    try {
      const userStr = Cookies.get(config.COOKIE_NAME_USER);
      let currentUser = null;
      try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
      const currentUserId = currentUser?.id || currentUser?.userId || null;

      const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
      const role = sessionStorage.getItem("userRole")?.toLowerCase();

      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("file", payload.file);
      formData.append("userId", currentUserId); // Explicitly required by some endpoints
      
      if (role === "tutor") {
        if (payload.studentIds && payload.studentIds.length > 0) {
          payload.studentIds.forEach((id) => {
            formData.append("studentId", id);
          });
        }
      } else if (role === "student" && profileRes?.status === "success") {
        const fullProfile = profileRes.data;
        const studentId = fullProfile.studentProfile?.id;
        const tutorId = fullProfile.studentProfile?.tutorId;
        
        // For students, add themselves to the recipient list
        if (studentId) {
          formData.append("studentId", studentId);
        }
        // Also explicitly send current tutorId if known
        if (tutorId) {
          formData.append("tutorId", tutorId);
        }
      }

      console.log("Uploading with FormData:", Array.from(formData.keys()));
      const result = await dataService.retrievePOSTFormData(formData, "/v1/documents");

      if (result && result.status === "success") {
        setOpenUpload(false);
        setSuccessMessage("Document uploaded successfully");
        setSuccessOpen(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("An error occurred during upload.");
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      // Backend does not have a batch delete, so we do it iteratively
      const deletePromises = documents.map(doc => 
        dataService.retrieveDELETE("/v1/documents/", doc.id)
      );
      await Promise.all(deletePromises);
      setSuccessMessage("All documents cleared successfully");
      setSuccessOpen(true);
      fetchDocuments();
    } catch (err) {
      console.error("Clearing error:", err);
      toast.error("Failed to clear some documents");
    } finally {
      setClearing(false);
    }
  };

  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    } else {
      alert("Download link not available.");
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    fetchDocuments();
  };

  const cleanFileName = (url) => {
    if (!url) return "document.pdf";
    try {
      // Remove query string first
      let name = url.split("?")[0].split("/").pop();
      // Remove the timestamp prefix (e.g., 1775361288877-)
      // It's usually a long string of digits followed by a hyphen
      name = name.replace(/^\d+-/, "");
      // Replace underscores with spaces for better readability, if desired
      // name = name.replace(/_/g, " ");
      return name;
    } catch (e) {
      return url.split("/").pop();
    }
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

        <Box display="flex" gap={2}>
          {isAdmin && documents.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              disabled={clearing}
              onClick={() => {
                if (window.confirm("Are you sure you want to delete ALL documents? This action is irreversible.")) {
                  handleClearAll();
                }
              }}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                px: 2,
                fontWeight: 600,
              }}
            >
              {clearing ? <CircularProgress size={20} color="inherit" /> : "Clear All Documents"}
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            onClick={handleOpenUpload}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              px: { xs: 2, sm: 3 },
              py: 1,
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Upload Document
          </Button>
        </Box>
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

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          fontWeight={700}
                          sx={{
                            fontSize: "0.95rem",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1
                          }}
                        >
                          {doc.title}
                        </Typography>
                        
                        {doc.uploadedBy?.id === currentUserId || isAdmin ? (
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setDocToDelete(doc);
                              setDeleteDialogOpen(true);
                            }}
                            sx={{ mt: -0.5, mr: -0.5 }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        ) : null}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 2,
                          fontSize: "0.8rem"
                        }}
                      >
                        {cleanFileName(doc.fileUrl)}
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
                            Uploaded by {doc.uploadedBy?.name || "Unknown"}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}
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

      <Dialog
        open={successOpen}
        onClose={handleCloseSuccess}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "calc(100% - 32px)",
            maxWidth: "500px",
            p: { xs: 3, sm: 4 },
            m: 2
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={4} mt={2}>
          <CheckCircleOutlineIcon sx={{ fontSize: 24, color: "text.primary" }} />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
            {successMessage}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleCloseSuccess}
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              fontWeight: 600,
              px: 4,
              py: 1,
              boxShadow: "none",
            }}
          >
            OK
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "calc(100% - 32px)",
            maxWidth: "400px",
            p: 2
          }
        }}
      >
        <Box p={2}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Delete Document
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Are you sure you want to delete "{docToDelete?.title}"? This action cannot be undone.
          </Typography>
          
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button 
               onClick={() => setDeleteDialogOpen(false)}
               sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button 
               variant="contained" 
               color="error"
               onClick={async () => {
                 if (docToDelete) {
                   const res = await dataService.retrieveDELETE("/v1/documents/", docToDelete.id);
                   if (res && (res.status === "success" || Object.keys(res).length === 0)) {
                     setDeleteDialogOpen(false);
                     setDocToDelete(null);
                     setSuccessMessage("Document deleted successfully");
                     setSuccessOpen(true);
                   } else {
                     toast.error(res?.message || "Failed to delete document");
                   }
                 }
               }}
               sx={{ textTransform: "none", fontWeight: 600, boxShadow: "none" }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;
