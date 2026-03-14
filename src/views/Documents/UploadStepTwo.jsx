import React from "react";
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const UploadStepTwo = ({
    students,
    selectedStudents,
    onSelectionChange,
    onBack,
    onUpload,
}) => {
    const isAllSelected =
        students.length > 0 && selectedStudents.length === students.length;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectionChange(students.map((student) => student.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            onSelectionChange(selectedStudents.filter((id) => id !== studentId));
        } else {
            onSelectionChange([...selectedStudents, studentId]);
        }
    };

    return (
        <>
            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 2, overflow: "hidden" }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Student name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>University email</TableCell>
                            <TableCell align="right">
                                <Checkbox
                                    checked={isAllSelected}
                                    indeterminate={
                                        selectedStudents.length > 0 &&
                                        selectedStudents.length < students.length
                                    }
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id} hover>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell align="right">
                                    <Checkbox
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => handleSelectOne(student.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <DialogActions sx={{ p: 0, pt: 3, gap: 1, justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    onClick={onBack}
                    sx={{
                        px: 5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "none",
                    }}
                >
                    ← Back
                </Button>

                <Button
                    variant="contained"
                    onClick={onUpload}
                    sx={{
                        px: 5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "none",
                    }}
                >
                    Upload
                </Button>
            </DialogActions>
        </>
    );
};

export default UploadStepTwo;
