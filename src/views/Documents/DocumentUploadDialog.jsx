import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadStepOne from "./UploadStepOne";
import UploadStepTwo from "./UploadStepTwo";

const mockStudents = [
    { id: 1, name: "Zue Zue", email: "zue@university.edu" },
    { id: 2, name: "Hmue", email: "hmue@university.edu" },
    { id: 3, name: "Gue Gue", email: "gue@university.edu" },
    { id: 4, name: "Ni Ni", email: "ni@university.edu" },
    { id: 5, name: "Ngu", email: "ngu@university.edu" },
    { id: 6, name: "Khin", email: "khin@university.edu" },
    { id: 7, name: "Phue Phue", email: "phue@university.edu" },
    { id: 8, name: "Eaint Eaint", email: "eaint@university.edu" },
    { id: 9, name: "Aung Aung", email: "aung@university.edu" },
    { id: 10, name: "Jhon", email: "jhon@university.edu" },
];

const DocumentUploadDialog = ({ open, onClose }) => {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: "",
        file: null,
        selectedStudents: [],
    });

    const handleClose = () => {
        setStep(1);
        setFormData({
            title: "",
            file: null,
            selectedStudents: [],
        });
        onClose();
    };

    const handleNextStep = ({ title, file }) => {
        setFormData((prev) => ({
            ...prev,
            title,
            file,
        }));
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleStudentSelection = (selectedStudents) => {
        setFormData((prev) => ({
            ...prev,
            selectedStudents,
        }));
    };

    const handleUpload = () => {
        const payload = {
            title: formData.title,
            file: formData.file,
            studentIds: formData.selectedStudents,
        };

        console.log("Upload payload:", payload);

        // Example API submit
        // const submitData = new FormData();
        // submitData.append("title", formData.title);
        // submitData.append("file", formData.file);
        // formData.selectedStudents.forEach((id) => {
        //   submitData.append("studentIds[]", id);
        // });

        // await axios.post("/api/documents/upload", submitData);

        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
                <Typography variant="h6" fontWeight="bold">
                    Upload Document
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Share a document with your students
                </Typography>

                <IconButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
                {step === 1 && (
                    <UploadStepOne
                        initialTitle={formData.title}
                        initialFile={formData.file}
                        onNext={handleNextStep}
                        onCancel={handleClose}
                    />
                )}

                {step === 2 && (
                    <UploadStepTwo
                        students={mockStudents}
                        selectedStudents={formData.selectedStudents}
                        onSelectionChange={handleStudentSelection}
                        onBack={handleBack}
                        onUpload={handleUpload}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DocumentUploadDialog;
