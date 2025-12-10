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
import { CloudUpload, CheckCircle, Error, Close } from "@mui/icons-material";
import PropTypes from "prop-types";

const SendDialog = ({
  open,
  fileName,
  progress,
  status, // 'waiting', 'sending', 'completed', 'rejected'
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escape") {
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
        {status === "waiting" && "Waiting for Acceptance..."}
        {status === "sending" && "Sending File..."}
        {status === "completed" && "File Sent!"}
        {status === "rejected" && "Transfer Rejected"}
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
          ) : status === "rejected" ? (
            <Error sx={{ fontSize: 48, color: "error.main" }} />
          ) : (
            <CloudUpload sx={{ fontSize: 48, color: "primary.main" }} />
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
            {status === "waiting" && "Waiting for peer to accept..."}
            {status === "rejected" && "Peer declined the file."}
          </Typography>
        </Box>

        {(status === "sending" || status === "completed") && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" color="text.secondary">
                {status === "sending" ? "Uploading..." : "Completed"}
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

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ borderRadius: "12px" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SendDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  fileName: PropTypes.string,
  progress: PropTypes.number,
  status: PropTypes.oneOf(["waiting", "sending", "completed", "rejected"]),
  onClose: PropTypes.func.isRequired,
};

export default SendDialog;
