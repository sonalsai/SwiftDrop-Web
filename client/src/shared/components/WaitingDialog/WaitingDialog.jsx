import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ContentCopy, Close } from "@mui/icons-material";
import PropTypes from "prop-types";

const WaitingDialog = ({ open, onClose, code, hasPeer }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // Could add toast here
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: "24px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        },
      }}
    >
      <Box sx={{ position: "absolute", right: 16, top: 16 }}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            size={80}
            thickness={2}
            sx={{ color: "var(--primary-blue)" }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {hasPeer ? "Connecting" : "Waiting"}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            {hasPeer ? "Peer Found!" : "Share this code"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasPeer
              ? "Establishing secure connection..."
              : "Share this code with the receiver to start the transfer"}
          </Typography>
        </Box>

        <Box
          onClick={handleCopy}
          sx={{
            background: "#F8F9FA",
            padding: "16px 32px",
            borderRadius: "16px",
            border: "2px dashed #D8E3F0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "var(--primary-blue)",
              background: "#F0F7FF",
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              letterSpacing: "4px",
              color: "var(--primary-blue)",
            }}
          >
            {code}
          </Typography>
          <ContentCopy sx={{ color: "text.secondary", fontSize: 20 }} />
        </Box>

        <Typography variant="caption" sx={{ color: "#aaa" }}>
          Click code to copy
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

WaitingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  code: PropTypes.string,
  hasPeer: PropTypes.bool,
};

export default WaitingDialog;
