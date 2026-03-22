import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Card,
  CircularProgress,
  Pagination,
} from "@mui/material";

type LeaderboardRow = {
  rank?: number;
  name: string;
  email: string;
  role: string;
  visits: number;
};

type MostActiveUsersTableProps = {
  data: LeaderboardRow[];
  loading: boolean;
  error?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const MostActiveUsersTable = ({
  data,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}: MostActiveUsersTableProps) => {

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {error || "No active users found."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((user, index) => (
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
                        fontWeight: 600,
                      }}
                    >
                      #{user.rank || index + 1}
                    </Box>
                  </TableCell>

                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.role || "-"}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.max(1, totalPages)}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              border: "1px solid",
              borderColor: "text.input",
              borderRadius: 0.5,
              p: 0.5,
            },
            "& .Mui-selected": {
              bgcolor: "primary.active",
              color: "primary.main",
              borderColor: "primary.main",
            },
          }}
        />
      </Box>
    </>
  );
};

export default MostActiveUsersTable;
