import { useState, useEffect } from "react";
import {
  Box,
  Card,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Stack,
  CircularProgress,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PageHeader from "../../layouts/main/components/PageHeader";
import CreateAccountDialog from "./CreateAccountDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import InputField from "../../layouts/main/components/InputFields";
import {
  BorderColorOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import Configuration from "../../services/configuration";
import DataServices from "../../services/data-services";
import ResetPassword from "./ResetPassword";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [selectedEmail, setSelectedEmail] = useState("");

  const config = new Configuration();
  const dataService = new DataServices();

  const fetchUsers = async (
    pageNumber = 1,
    searchValue = "",
    roleValue = "All",
  ) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", pageNumber);
      params.append("limit", limit);

      if (searchValue) {
        params.append("search", searchValue);
      }

      if (roleValue !== "All") {
        params.append("role", roleValue);
      }

      const serviceAction = `${config.SERVICE_USERS}?${params.toString()}`;

      const res = await dataService.retrieve(
        config.SERVICE_NAME,
        serviceAction,
      );

      if (res?.status === "success" && Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalPages(res?.pagination?.totalPages || 1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search, role);
  }, [page, search, role]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      <PageHeader
        title="Create Accounts"
        subtitle="Create Tutors and Students Accounts"
        buttonText="Create Account"
        onButtonClick={() => setOpenCreate(true)}
      />
      <Stack direction="row" spacing={2} mb={3}>
        <InputField
          placeholder="Search by username or email..."
          size="small"
          icon={SearchIcon}
          placeholderColor="text.secondary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(1);
              fetchUsers(1, search, role);
            }
          }}
        />
        <InputField
          select
          size="small"
          sx={{ width: 200 }}
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="TUTOR">Tutor</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="STAFF">Staff</MenuItem>
        </InputField>
      </Stack>
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
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Created At</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedEmail(user.email);
                        setOpenEdit(true);
                      }}
                    >
                      <BorderColorOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setOpenDelete(true);
                      }}
                    >
                      <DeleteOutlineOutlined fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
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
      <CreateAccountDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        userId={selectedUserId}
        onSuccess={() => fetchUsers(page)}
      />
      <ResetPassword
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        email={selectedEmail}
      />{" "}
    </Box>
  );
};

export default UserList;
