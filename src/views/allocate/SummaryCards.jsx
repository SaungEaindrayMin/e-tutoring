import { Box, Card, Typography } from "@mui/material";
import {
  CheckCircleOutline,
  ErrorOutline,
  PeopleAltOutlined,
} from "@mui/icons-material";

const SummaryCards = () => {
  const cards = [
    {
      title: "Total Students",
      value: 10,
      icon: <PeopleAltOutlined color="primary" />,
    },
    {
      title: "Assigned",
      value: 5,
      icon: <CheckCircleOutline sx={{ color: "green" }} />,
    },
    {
      title: "Unassigned",
      value: 5,
      icon: <ErrorOutline sx={{ color: "red" }} />,
    },
  ];

  return (
    <Box display="flex" gap={3} mt={3}>
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            flex: 1,
            p: 3,
            boxShadow: "xs",
            border: 0.5,
            borderColor: "text.input",
            borderRadius:0.5,
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
            <Typography variant="h4">{card.value}</Typography>
            {card.icon}
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default SummaryCards;
