import React, { useState, useEffect } from "react";
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
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import Cookies from "js-cookie";

const dataService = new DataServices();
const config = new Configuration();

const DocumentUploadDialog = ({ open, onClose, onUpload, submitting }) => {
    const role = sessionStorage.getItem("userRole"); // "STUDENT" | "TUTOR"
    const normalizedRole = role?.toLowerCase();
    const isStudent = normalizedRole === "student";
    const [step, setStep] = useState(1);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (open && !isStudent) {
            fetchStudents();
        }
    }, [open, isStudent]);

    const fetchStudents = async () => {
        try {
            const userStr = Cookies.get(config.COOKIE_NAME_USER);
            let currentUser = null;
            try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
            const currentUserId = currentUser?.id || currentUser?.userId || null;

            if (!currentUserId) return;

            // Fetch current user's profile to get relationship context
            const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
            let myRelationshipId = null; 
            
            if (profileRes?.status === "success" && profileRes.data) {
                const profile = profileRes.data;
                myRelationshipId = profile.tutorProfile?.id;
            }

            const serviceAction = `${config.SERVICE_USERS}?page=1&limit=50&role=STUDENT`;
            const res = await dataService.retrieve(config.SERVICE_NAME, serviceAction);
            
            let fetchedUsers = [];
            if (res?.status === "success" && Array.isArray(res.data)) {
                fetchedUsers = res.data;
            } else if (res?.data?.results) {
                fetchedUsers = res.data.results;
            }

            // Filter users based on relationship (show only assigned students)
            const filteredUsers = fetchedUsers.filter(u => u.studentProfile?.tutorId === myRelationshipId);
            setStudents(filteredUsers);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };
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
        const updatedData = { ...formData, title, file };
        setFormData(updatedData);
        
        if (isStudent) {
            // Students skip step 2 and upload directly
            onUpload({
                title: updatedData.title,
                file: updatedData.file,
                studentIds: [] // Backend handles recipient for students
            });
        } else {
            setStep(2);
        }
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
        if (!isStudent && formData.selectedStudents.length === 0) {
            alert("Please select at least one student!");
            return;
        }

        onUpload({
            title: formData.title,
            file: formData.file,
            studentIds: formData.selectedStudents,
        });
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
                        isStudent={normalizedRole === "student"}
                        isSubmitting={submitting}
                    />
                )}

                {step === 2 && (
                    <UploadStepTwo
                        students={students}
                        selectedStudents={formData.selectedStudents}
                        onSelectionChange={handleStudentSelection}
                        onBack={handleBack}
                        onUpload={handleUpload}
                        isSubmitting={submitting}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DocumentUploadDialog;
