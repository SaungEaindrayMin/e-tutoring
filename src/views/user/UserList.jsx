import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Stack,
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

const users = [
  { name: "Hmue", email: "hmue@university.edu", role: "Tutor" },
  { name: "Ni Ni", email: "ni@university.edu", role: "Tutor" },
  { name: "Khin", email: "khin@university.edu", role: "Tutor" },
  { name: "Eaint Eaint", email: "eaint@university.edu", role: "Tutor" },
  { name: "Jhon", email: "jhon@university.edu", role: "Tutor" },
];

const UserList = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

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
          placeholder="Search..."
          size="small"
          icon={SearchIcon}
          placeholderColor="text.secondary"
        />
        <TextField select size="small" sx={{ width: 200 }} defaultValue="All">
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Tutor">Tutors</MenuItem>
          <MenuItem value="Student">Students</MenuItem>
        </TextField>
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
                <b>Create at</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>Feb-20, 8:00 AM</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <BorderColorOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setOpenDelete(true)}
                  >
                    <DeleteOutlineOutlined fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={10}
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
      />
    </Box>
  );
};

export default UserList;
