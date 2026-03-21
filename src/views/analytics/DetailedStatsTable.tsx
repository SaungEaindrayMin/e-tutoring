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
import PublicIcon from "@mui/icons-material/Public";

type DetailRow = {
  page: string;
  browser: string;
  visits: number;
};

type DetailedStatsTableProps = {
  data: DetailRow[];
  loading: boolean;
  error?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const DetailedStatsTable = ({
  data,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
}: DetailedStatsTableProps) => {

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {error || "No detail statistics found."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
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

export default DetailedStatsTable;
