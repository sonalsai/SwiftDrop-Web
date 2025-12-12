import {
  CheckCircleOutline,
  FileUploadOutlined,
  CloudUploadOutlined,
  Close,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";

const FileUploadZone = ({
  isDragging,
  selectedFile,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileSelect,
  onSendFile,
  onRemoveFile,
}) => {
  return (
    <Paper
      onClick={() => document.getElementById("file-input").click()}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      elevation={0}
      sx={{
        width: "100%",
        height: "360px",
        padding: "32px",
        borderRadius: "20px",
        border: `2px dashed ${
          isDragging ? "var(--primary-blue)" : "var(--border-light)"
        }`,
        background: isDragging
          ? "linear-gradient(135deg, var(--soft-background) 0%, #F0F7FF 100%)"
          : "linear-gradient(135deg, var(--white) 0%, var(--soft-background) 100%)",
        transition: "all 0.25s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: isDragging
          ? "0 12px 32px var(--shadow-lg)"
          : "0 4px 16px var(--shadow-sm)",
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        type="file"
        id="file-input"
        onChange={onFileSelect}
        style={{ display: "none" }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          width: "100%",
        }}
      >
        {/* Upload Icon */}
        <Box
          className="upload-icon"
          sx={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--primary-blue) 0%, #0D47A1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.25s ease",
            boxShadow: "0 8px 24px rgba(26, 115, 232, 0.3)",
          }}
        >
          <FileUploadOutlined sx={{ fontSize: 48, color: "white" }} />
        </Box>

        {/* FILE SELECTED UI */}
        {selectedFile ? (
          <Box sx={{ textAlign: "center", position: "relative" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Chip
                label={selectedFile.name}
                sx={{
                  fontSize: "16px",
                  padding: "16px",
                  height: "auto",
                  "& .MuiChip-label": { padding: "0 12px" },
                  backgroundColor: "var(--success-accent)",
                  color: "var(--text-dark)",
                  fontWeight: "600",
                  borderRadius: "12px",
                  maxWidth: "100%",
                }}
              />
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                sx={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "24px",
                  height: "24px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)", // Glass-morphism dark gray
                  backdropFilter: "blur(4px)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <Close sx={{ fontSize: "14px", color: "white" }} />
              </Box>
            </Box>

            {/* File Size */}
            <Typography
              sx={{
                marginTop: "12px",
                color: "#5F6368",
                fontSize: "14px",
              }}
            >
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>

            {/* SEND FILE BUTTON */}
            <Button
              variant="contained"
              startIcon={<CloudUploadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onSendFile();
              }}
              sx={{
                marginTop: "26px",
                backgroundColor: "var(--primary-blue)",
                color: "white",
                padding: "14px 32px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 6px 18px rgba(26, 115, 232, 0.30)",
                transition: "0.25s ease",
                "&:hover": {
                  backgroundColor: "#0D47A1",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(26, 115, 232, 0.40)",
                },
              }}
            >
              Send File
            </Button>
          </Box>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                color: "var(--text-dark)",
                fontWeight: 600,
              }}
            >
              Drag & Drop Your File Here
            </Typography>

            <Typography
              sx={{
                color: "#5F6368",
                fontSize: "16px",
              }}
            >
              or click anywhere to select
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

FileUploadZone.propTypes = {
  isDragging: PropTypes.bool.isRequired,
  selectedFile: PropTypes.object,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired,
  onSendFile: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired, // ⬅ NEW
};

export default FileUploadZone;
