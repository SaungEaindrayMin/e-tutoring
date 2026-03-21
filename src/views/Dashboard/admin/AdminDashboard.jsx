import { Box } from "@mui/material";
import PageHeader from "../../../layouts/main/components/PageHeader";
import StatsCard from "../../../layouts/main/components/StatsCard";
import { Person2Outlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    totalTutors: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setData({
        totalStudents: 15,
        totalTutors: 20,
        assignedStudents: 10,
        unassignedStudents: 20,
      });
      setLoading(false);
    }, 800);
  }, []);

  return (
    <Box>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Create Tutors and Students Accounts"
      />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
        <StatsCard
          title="Total Students"
          value={data.totalStudents}
          icon={<Person2Outlined sx={{ color: "primary.main" }} />}
          loading={loading}
          sx={{ border: 0.5, boxShadow: "none" }}
        />

        <StatsCard
          title="Total Tutors"
          value={data.totalTutors}
          icon={<Person2Outlined sx={{ color: "text.message" }} />}
          loading={loading}
          sx={{ border: 0.5, borderColor: "text.input", boxShadow: "none" }}
        />

        <StatsCard
          title="Assigned Students"
          value={data.assignedStudents}
          icon={<Person2Outlined sx={{ color: "text.document" }} />}
          loading={loading}
          sx={{ border: 0.5, borderColor: "text.input", boxShadow: "none" }}
        />

        <StatsCard
          title="Unassigned Students"
          value={data.unassignedStudents}
          icon={<Person2Outlined sx={{ color: "text.danger" }} />}
          loading={loading}
          sx={{ border: 0.5, borderColor: "text.input", boxShadow: "none" }}
        />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
