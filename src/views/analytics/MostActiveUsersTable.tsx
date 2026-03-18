import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Card,
} from "@mui/material";

const MostActiveUsersTable = () => {
  const data = [
    { name: "Admin User", role: "Admin", visits: 23 },
    { name: "Alice", role: "Student", visits: 23 },
    { name: "Dr. Sarah Brown", role: "Tutor", visits: 23 },
    { name: "Staff User", role: "Staff", visits: 23 },
  ];

  return (
    <>
      <Typography variant="h6" mb={2}>
        Most Active Users
      </Typography>

      <Card
        sx={{
          border: 0.5,
          borderColor: "text.input",
          borderRadius: 0.5,
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>RANK</b>
              </TableCell>
              <TableCell>
                <b>USERS</b>
              </TableCell>
              <TableCell>
                <b>EMAIL</b>
              </TableCell>
              <TableCell>
                <b>ROLE</b>
              </TableCell>
              <TableCell>
                <b>TOTAL VISITS</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableCell-root": { borderBottom: "none" },
            }}
          >
            {data.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box
                    sx={{
                      bgcolor: "primary.analytics",
                      color: "text.analytics",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight:600,
                    }}
                  >
                    #{index + 1}
                  </Box>
                </TableCell>

                <TableCell>{user.name}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      bgcolor: "background.analytics",
                      px: 2,
                      py: 0.5,
                      borderRadius: 0.5,
                      display: "inline-block",
                    }}
                  >
                    {user.visits}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default MostActiveUsersTable;
