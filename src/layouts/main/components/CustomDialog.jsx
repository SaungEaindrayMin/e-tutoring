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
  subtitle,
  children,
  actions,
  maxWidth = "md",
  titleAlign = "left",
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" textAlign={titleAlign}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ mt: -1, mr: -1 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default CustomDialog;
