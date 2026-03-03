import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  titleAlign = "center",
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogTitle sx={{ px: 3 }}>
        <Typography variant="h6" textAlign={titleAlign}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default CustomDialog;
