import { Box, Typography, Checkbox } from "@mui/material";

const studentsList = [
  { name: "Zue Zue", email: "zue@university.edu" },
  { name: "Hmue", email: "hmue@university.edu" },
  { name: "Gue Gue", email: "gue@university.edu" },
  { name: "Ni Ni", email: "ni@university.edu" },
  { name: "Ngu", email: "ngu@university.edu" },
  { name: "Khin", email: "khin@university.edu" },
  { name: "Phue Phue", email: "phue@university.edu" },
  { name: "Eaint Eaint", email: "eaint@university.edu" },
  { name: "Aung Aung", email: "aung@university.edu" },
  { name: "Jhon", email: "jhon@university.edu" },
];

const SelectStudentsStep = ({ formData, setFormData }) => {
  const handleToggle = (email) => {
    const currentIndex = formData.selectedStudents.indexOf(email);
    const newSelected = [...formData.selectedStudents];

    if (currentIndex === -1) {
      newSelected.push(email);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setFormData({ ...formData, selectedStudents: newSelected });
  };

  const handleToggleAll = () => {
    if (formData.selectedStudents.length === studentsList.length) {
      setFormData({ ...formData, selectedStudents: [] });
    } else {
      setFormData({ ...formData, selectedStudents: studentsList.map((s) => s.email) });
    }
  };

  return (
    <Box sx={{ border: "1px solid", borderColor: "text.input", borderRadius: "8px", mt: 1 }}>
      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          alignItems: "center",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "text.input",
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          Student name
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          University email
        </Typography>
        <Checkbox
          checked={formData.selectedStudents.length === studentsList.length && studentsList.length > 0}
          indeterminate={formData.selectedStudents.length > 0 && formData.selectedStudents.length < studentsList.length}
          onChange={handleToggleAll}
          sx={{ py: 0, color: "text.input", "&.Mui-checked": { color: "primary.main" } }}
        />
      </Box>

      {/* List */}
      <Box sx={{ maxHeight: 400, overflowY: "auto", py: 1 }}>
        {studentsList.map((student, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              alignItems: "center",
              px: 3,
              py: 1.5,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {student.name}
            </Typography>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {student.email}
            </Typography>
            <Checkbox
              checked={formData.selectedStudents.indexOf(student.email) !== -1}
              onChange={() => handleToggle(student.email)}
              sx={{ py: 0, color: "text.input", "&.Mui-checked": { color: "primary.main" } }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SelectStudentsStep;
