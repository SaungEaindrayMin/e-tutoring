import { useEffect, useState } from "react";
import { Box, Typography, Checkbox, CircularProgress } from "@mui/material";
import DataServices from "../../services/data-services";
import Configuration from "../../services/configuration";
import Cookies from "js-cookie";

const SelectStudentsStep = ({ formData, setFormData, isTutor }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCounterparty = async () => {
      setLoading(true);
      const dataService = new DataServices();
      const config = new Configuration();

      try {
        const userStr = Cookies.get(config.COOKIE_NAME_USER);
        let currentUser = null;
        try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (e) { }
        const currentUserId = currentUser?.id || currentUser?.userId || null;

        if (!currentUserId) {
          setLoading(false);
          return;
        }

        // Fetch current user's profile to get relationship context
        const profileRes = await dataService.retrieve(config.SERVICE_NAME, `${config.SERVICE_USERS}/${currentUserId}`);
        let myRelationshipId = null; 
        
        if (profileRes?.status === "success" && profileRes.data) {
          const profile = profileRes.data;
          if (isTutor) {
            myRelationshipId = profile.tutorProfile?.id;
          } else {
            myRelationshipId = profile.studentProfile?.tutorId;
          }
        }

        const targetRole = isTutor ? "STUDENT" : "TUTOR";
        const serviceAction = `${config.SERVICE_USERS}?page=1&limit=50&role=${targetRole}`;
        const res = await dataService.retrieve(config.SERVICE_NAME, serviceAction);
        
        let fetchedUsers = [];
        if (res?.status === "success" && Array.isArray(res.data)) {
          fetchedUsers = res.data;
        } else if (res?.data?.results) {
          fetchedUsers = res.data.results;
        }

        // Filter users based on relationship
        let filteredUsers = fetchedUsers;
        if (isTutor) {
          // If Tutor: show only assigned students
          filteredUsers = fetchedUsers.filter(u => u.studentProfile?.tutorId === myRelationshipId);
        } else {
          // If Student: show only assigned tutor
          filteredUsers = fetchedUsers.filter(u => u.tutorProfile?.id === myRelationshipId);
          // Auto-select the tutor if only one exists and nothing is selected
          if (filteredUsers.length === 1 && formData.selectedStudents.length === 0) {
            setFormData(prev => ({ ...prev, selectedStudents: [filteredUsers[0]] }));
          }
        }

        setUsersList(filteredUsers);
      } catch (err) {
        console.error("Error fetching counterparties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounterparty();
  }, [isTutor, setFormData]);

  const handleToggle = (user) => {
    const isSelected = formData.selectedStudents.findIndex((u) => u.id === user.id) !== -1;
    if (isSelected) {
      setFormData({ 
        ...formData, 
        selectedStudents: formData.selectedStudents.filter(u => u.id !== user.id) 
      });
    } else {
      setFormData({ 
        ...formData, 
        selectedStudents: [...formData.selectedStudents, user] 
      });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setFormData({ ...formData, selectedStudents: [...usersList] });
    } else {
      setFormData({ ...formData, selectedStudents: [] });
    }
  };

  const isAllSelected = usersList.length > 0 && formData.selectedStudents.length === usersList.length;
  const isSomeSelected = formData.selectedStudents.length > 0 && formData.selectedStudents.length < usersList.length;

  return (
    <Box sx={{ border: "1px solid", borderColor: "text.input", borderRadius: "8px", mt: 1 }}>
      {/* Header */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr auto", sm: "1fr 1fr auto" },
          alignItems: "center",
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "text.input",
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {isTutor ? "Student name" : "Tutor name"}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ display: { xs: "none", sm: "block" } }}>
          University email
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={handleSelectAll}
                sx={{ py: 0, color: "text.input", "&.Mui-checked": { color: "primary.main" } }}
            />
        </Box>
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
                gridTemplateColumns: { xs: "1fr auto", sm: "1fr 1fr auto" },
                alignItems: "center",
                px: { xs: 2, sm: 3 },
                py: 1.5,
                borderBottom: i < usersList.length - 1 ? "1px solid" : "none",
                borderColor: "background.switch",
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {user.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: { xs: "block", sm: "none" }, wordBreak: "break-all" }}
                >
                  {user.email}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ display: { xs: "none", sm: "block" } }}>
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
