import {
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import CustomDialog from "../../layouts/main/components/CustomDialog";
import InputField from "../../layouts/main/components/InputFields";
import SearchIcon from "@mui/icons-material/Search";

const tutors = [
  { id: 1, name: "Dr. Sarah Brown", email: "sarahbrown@university.edu" },
  { id: 2, name: "Prof. Michael Chen", email: "michael@university.edu" },
];

const AssignTutorDialog = ({ open, onClose }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title="Allocate Personal Tutor"
      titleAlign="start"
      actions={
        <Button variant="contained" onClick={onClose} sx={{px:5}}>
          Assign
        </Button>
      }
    >
      <Typography sx={{ mb: 1, color: "text.muted" }}>
        Select tutor to assign
      </Typography>

      <InputField
        icon={SearchIcon}
        size="small"
        placeholder="Search..."
        sx={{ mb: 2 }}
      />

      <TableContainer
        component={Paper}
        sx={{
          border: 0.5,
          borderColor: "text.input",
          borderRadius: 0.5,
          overflow: "hidden",
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tutor name</TableCell>
              <TableCell>University email</TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& .MuiTableCell-root": { borderBottom: "none" },
            }}
          >
            {tutors.map((tutor) => (
              <TableRow key={tutor.id} hover>
                <TableCell>{tutor.name}</TableCell>
                <TableCell>{tutor.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomDialog>
  );
};

export default AssignTutorDialog;
