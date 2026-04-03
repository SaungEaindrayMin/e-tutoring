import { useEffect, useState } from "react";
import { Box, Typography, Checkbox, CircularProgress } from "@mui/material";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";

const SelectStudentsStep = ({ formData, setFormData, isTutor }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCounterparty = async () => {
      setLoading(true);
      const dataService = new DataServices();
      const config = new Configuration();
      const targetRole = isTutor ? "STUDENT" : "TUTOR";
      const serviceAction = `${config.SERVICE_USERS}?page=1&limit=50&role=${targetRole}`;
      
      const res = await dataService.retrieve(config.SERVICE_NAME, serviceAction);
      if (res?.status === "success" && Array.isArray(res.data)) {
        setUsersList(res.data);
      } else if (res?.data?.results) {
        setUsersList(res.data.results);
      } else {
        setUsersList([]);
      }
      setLoading(false);
    };
    fetchCounterparty();
  }, [isTutor]);

  const handleToggle = (user) => {
    const currentIndex = formData.selectedStudents.findIndex((u) => u.id === user.id);
    const newSelected = [...formData.selectedStudents];

    if (currentIndex === -1) {
      newSelected.push(user);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setFormData({ ...formData, selectedStudents: newSelected });
  };

  const handleToggleAll = () => {
    if (formData.selectedStudents.length === usersList.length && usersList.length > 0) {
      setFormData({ ...formData, selectedStudents: [] });
    } else {
      setFormData({ ...formData, selectedStudents: usersList });
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
          {isTutor ? "Student name" : "Tutor name"}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          University email
        </Typography>
        <Checkbox
          checked={formData.selectedStudents.length === usersList.length && usersList.length > 0}
          indeterminate={formData.selectedStudents.length > 0 && formData.selectedStudents.length < usersList.length}
          onChange={handleToggleAll}
          sx={{ py: 0, color: "text.input", "&.Mui-checked": { color: "primary.main" } }}
        />
      </Box>

      {/* List */}
      <Box sx={{ maxHeight: 400, overflowY: "auto", py: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : usersList.length === 0 ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Typography variant="body2" color="text.secondary">No users found.</Typography>
          </Box>
        ) : (
          usersList.map((user, i) => (
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
                {user.name}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {user.email}
              </Typography>
              <Checkbox
                checked={formData.selectedStudents.findIndex((u) => u.id === user.id) !== -1}
                onChange={() => handleToggle(user)}
                sx={{ py: 0, color: "text.input", "&.Mui-checked": { color: "primary.main" } }}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default SelectStudentsStep;
