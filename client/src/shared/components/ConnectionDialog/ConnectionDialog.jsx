import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Link, LinkOff } from "@mui/icons-material";
import PropTypes from "prop-types";

const ConnectionDialog = ({ open, onClose, onConnect }) => {
  const [connectionCode, setConnectionCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (connectionCode.length >= 6) {
      onConnect(connectionCode);
      setConnectionCode("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: "16px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          pt: 1,
        }}
      >
        <Box
          sx={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Link sx={{ fontSize: "32px", color: "var(--primary-blue)" }} />
        </Box>

        <DialogTitle sx={{ p: 0, fontWeight: 700, fontSize: "24px" }}>
          Connect Device
        </DialogTitle>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ maxWidth: "80%", mt: -1 }}
        >
          Enter the 6-character code displayed on the receiver device
        </Typography>

        <DialogContent sx={{ width: "100%", p: "16px 0" }}>
          <form onSubmit={handleSubmit} id="connection-form">
            <TextField
              autoFocus
              fullWidth
              placeholder="1A2B3C"
              value={connectionCode}
              onChange={(e) => {
                // Allow only alphanumeric characters and convert to uppercase
                const formattedValue = e.target.value
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toUpperCase()
                  .slice(0, 6);
                setConnectionCode(formattedValue);
              }}
              inputProps={{
                style: {
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: 600,
                  letterSpacing: "4px",
                  padding: "16px",
                },
                maxLength: 6,
                spellCheck: false,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#F8F9FA",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--primary-blue)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--primary-blue)",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </form>
        </DialogContent>

        <DialogActions
          sx={{ width: "100%", p: 0, display: "flex", gap: "12px" }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: "14px",
              padding: "12px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              color: "text.secondary",
              borderColor: "rgba(0,0,0,0.12)",
              "&:hover": {
                borderColor: "text.primary",
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            disabled={connectionCode.length < 6}
            sx={{
              borderRadius: "14px",
              padding: "12px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 600,
              boxShadow: "none",
              backgroundColor: "var(--primary-blue)",
              "&:hover": {
                backgroundColor: "#0D47A1",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
              },
            }}
          >
            Connect
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

ConnectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
};

export default ConnectionDialog;
