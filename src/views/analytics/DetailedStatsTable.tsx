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
import PublicIcon from "@mui/icons-material/Public";

const DetailedStatsTable = () => {
  const data = [
    { page: "Dashboard", browser: "Chrome", visits: 23 },
    { page: "Dashboard", browser: "Safari", visits: 6 },
    { page: "Visit Analytics", browser: "Safari", visits: 4 },
    { page: "Visit Analytics", browser: "Chrome", visits: 3 },
    { page: "Blog", browser: "Chrome", visits: 3 },
    { page: "Create Accounts", browser: "Safari", visits: 1 },
  ];

  return (
    <>
      <Typography variant="h6">Detailed Statistics</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Page visits breakdown by browser
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
                <b>PAGE NAME</b>
              </TableCell>
              <TableCell>
                <b>BROWSER</b>
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
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "primary.analytics",
                        borderRadius: "50%",
                      }}
                    />
                    {item.page}
                  </Box>
                </TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PublicIcon fontSize="small" />
                    {item.browser}
                  </Box>
                </TableCell>

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
                    {item.visits}
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

export default DetailedStatsTable;
