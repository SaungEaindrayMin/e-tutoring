import { Box, Card, Typography, CircularProgress } from "@mui/material";
import {
  CheckCircleOutline,
  ErrorOutline,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";

const SummaryCards = () => {
  const [counts, setCounts] = useState({
    totalStudents: 0,
    totalAssigned: 0,
    totalUnassigned: 0,
  });

  const [loading, setLoading] = useState(false);

  const config = new Configuration();
  const dataService = new DataServices();

  const fetchCounts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", 1);

      const serviceAction = `${config.SERVICE_USERS}?${params.toString()}`;

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success" && res?.counts) {
        setCounts({
          totalStudents: res.counts.totalStudents || 0,
          totalAssigned: res.counts.totalAssigned || 0,
          totalUnassigned: res.counts.totalUnassigned || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch summary counts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: counts.totalStudents,
      icon: <PeopleAltOutlined color="primary" />,
    },
    {
      title: "Assigned",
      value: counts.totalAssigned,
      icon: <CheckCircleOutline sx={{ color: "green" }} />,
    },
    {
      title: "Unassigned",
      value: counts.totalUnassigned,
      icon: <ErrorOutline sx={{ color: "red" }} />,
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={2}
      mt={3}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            boxShadow: "xs",
            border: 0.5,
            borderColor: "text.input",
            borderRadius: 0.5,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {card.title}
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{card.value}</Typography>
            )}

            {card.icon}
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default SummaryCards;
