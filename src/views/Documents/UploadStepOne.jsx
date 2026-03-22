import React, { useRef, useState } from "react";
import {
    Typography,
    TextField,
    Button,
    Box,
    DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadStepOne = ({ initialTitle, initialFile, onNext, onCancel }) => {
    const [title, setTitle] = useState(initialTitle || "");
    const [file, setFile] = useState(initialFile || null);
    const [errors, setErrors] = useState({ title: false, file: false });
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef(null);

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const isValidFile = (selectedFile) => {
        if (!selectedFile) return false;

        const maxSize = 10 * 1024 * 1024; // 10MB
        const validExtension = /\.(pdf|doc|docx)$/i.test(selectedFile.name);

        return (
            (allowedTypes.includes(selectedFile.type) || validExtension) &&
            selectedFile.size <= maxSize
        );
    };

    const setSelectedFile = (selectedFile) => {
        if (selectedFile && isValidFile(selectedFile)) {
            setFile(selectedFile);
            setErrors((prev) => ({ ...prev, file: false }));
        } else {
            setFile(null);
            setErrors((prev) => ({ ...prev, file: true }));
        }
    };

    const handleOpenFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        setSelectedFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files?.[0];
        setSelectedFile(droppedFile);
    };

    const handleNext = () => {
        const hasTitle = title.trim() !== "";
        const hasFile = !!file;

        setErrors({
            title: !hasTitle,
            file: !hasFile,
        });

        if (hasTitle && hasFile) {
            onNext({
                title: title.trim(),
                file,
            });
        }
    };

    return (
        <>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Document Title*
            </Typography>

            <TextField
                fullWidth
                placeholder="e.g. Assignment 2 - database Design"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: false }));
                }}
                error={errors.title}
                helperText={errors.title ? "Please fill document title!" : ""}
                sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                File *
            </Typography>

            <Box
                onClick={handleOpenFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    border: errors.file
                        ? "1px dashed #d32f2f"
                        : dragActive
                            ? "2px dashed #1976d2"
                            : "1px dashed #C4C4C4",
                    borderRadius: 2,
                    py: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "center",
                    bgcolor: errors.file
                        ? "rgba(211, 47, 47, 0.02)"
                        : dragActive
                            ? "rgba(25, 118, 210, 0.06)"
                            : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                }}
            >
                <CloudUploadIcon sx={{ fontSize: 40, color: "grey.400", mb: 1 }} />

                <Typography variant="body2" color="text.secondary">
                    Click to upload or drag and drop <br />
                    PDF, DOC, DOCX up to 10 MB
                </Typography>

                <TextField
                    value={file ? file.name : ""}
                    placeholder="Select a file"
                    sx={{
                        mt: 2,
                        width: "80%",
                        bgcolor: "#f5f5f5",
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                    InputProps={{
                        readOnly: true,
                        sx: { pointerEvents: "none", fontSize: "0.875rem" },
                    }}
                />

                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                />
            </Box>

            {errors.file && (
                <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                    Please upload a valid PDF, DOC, or DOCX file under 10 MB.
                </Typography>
            )}

            <DialogActions sx={{ p: 0, pt: 3, gap: 1, justifyContent: "flex-end" }}>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        color: "grey.700",
                        borderColor: "grey.300",
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                        px: 6,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "none",
                    }}
                >
                    Next
                </Button>
            </DialogActions>
        </>
    );
};

export default UploadStepOne;
