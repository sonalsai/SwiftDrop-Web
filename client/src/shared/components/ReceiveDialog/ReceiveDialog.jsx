import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  CloudDownload,
  InsertDriveFile,
  Cancel,
  CheckCircle,
  Close,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const ReceiveDialog = ({
  open,
  fileName,
  fileSize,
  progress,
  status, // 'request', 'receiving', 'completed'
  onAccept,
  onReject,
  onDownload,
  onClose,
}) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escape") {
          // Prevent closing by clicking outside if receiving
          onClose();
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: "16px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        },
      }}
    >
      <Box sx={{ position: "absolute", right: 16, top: 16 }}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <DialogTitle sx={{ fontWeight: "bold", pb: 1, mt: 2 }}>
        {status === "request" && "Incoming File Request"}
        {status === "receiving" && "Receiving File..."}
        {status === "completed" && "File Received!"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            mt: 1,
          }}
        >
          {status === "completed" ? (
            <CheckCircle sx={{ fontSize: 48, color: "success.main" }} />
          ) : (
            <InsertDriveFile sx={{ fontSize: 48, color: "primary.main" }} />
          )}
        </Box>

        <Box textAlign="center">
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem", wordBreak: "break-all" }}
          >
            {fileName || "Unknown File"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {fileSize ? formatSize(fileSize) : "Size unknown"}
          </Typography>
        </Box>

        {(status === "receiving" || status === "completed") && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                {status === "receiving" ? "Downloading..." : "Completed"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "action.selected",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 2,
          gap: 2,
          flexDirection: "column",
        }}
      >
        {status === "request" && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={onReject}
              sx={{ borderRadius: "12px", px: 3 }}
            >
              Decline
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownload />}
              onClick={onAccept}
              sx={{ borderRadius: "12px", px: 3 }}
            >
              Accept
            </Button>
          </Box>
        )}

        {status === "completed" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<CloudDownload />}
              onClick={onDownload}
              fullWidth
              sx={{ borderRadius: "12px" }}
            >
              Download File
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={onClose}
              fullWidth
              sx={{ borderRadius: "12px" }}
            >
              Close
            </Button>
          </Box>
        )}

        {status === "receiving" && (
          <Button variant="text" disabled>
            Please wait...
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ReceiveDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  fileName: PropTypes.string,
  fileSize: PropTypes.number,
  progress: PropTypes.number,
  status: PropTypes.oneOf(["request", "receiving", "completed"]),
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onDownload: PropTypes.func,
  onClose: PropTypes.func,
};

export default ReceiveDialog;
