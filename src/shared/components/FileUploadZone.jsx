import {
  CloudUploadOutlined,
  CheckCircleOutline,
  FolderOpenOutlined,
} from "@mui/icons-material";
import { Box, Button, Typography, Paper, Chip } from "@mui/material";
import PropTypes from "prop-types";

const FileUploadZone = ({
  isDragging,
  selectedFile,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileSelect,
}) => {
  return (
    <Paper
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      elevation={0}
      sx={{
        width: "100%",
        padding: "64px 48px",
        borderRadius: "var(--radius-lg)",
        border: `2px dashed ${
          isDragging ? "var(--primary-blue)" : "var(--border-light)"
        }`,
        background: isDragging
          ? "linear-gradient(135deg, var(--soft-background) 0%, #F0F7FF 100%)"
          : "linear-gradient(135deg, var(--white) 0%, var(--soft-background) 100%)",
        transition: "all var(--transition-fast)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: isDragging
          ? "0 12px 32px var(--shadow-lg)"
          : "0 4px 16px var(--shadow-sm)",
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        "&:hover": {
          borderColor: "var(--primary-blue)",
          boxShadow: "0 8px 24px var(--shadow-md)",
          "& .upload-icon": {
            transform: "translateY(-8px)",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Box
          className="upload-icon"
          sx={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--primary-blue) 0%, #0D47A1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "var(--transition-fast)",
            boxShadow: "0 8px 24px rgba(26, 115, 232, 0.3)",
          }}
        >
          <CloudUploadOutlined sx={{ fontSize: 64, color: "white" }} />
        </Box>

        {selectedFile ? (
          <Box sx={{ textAlign: "center" }}>
            <Chip
              icon={<CheckCircleOutline />}
              label={selectedFile.name}
              color="success"
              sx={{
                fontSize: "16px",
                padding: "24px 16px",
                height: "auto",
                "& .MuiChip-label": { padding: "0 12px" },
                backgroundColor: "var(--success-accent)",
                color: "var(--text-dark)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            />
            <Typography
              sx={{
                marginTop: "16px",
                color: "#5F6368",
                fontSize: "14px",
              }}
            >
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                color: "var(--text-dark)",
                fontWeight: "var(--font-weight-semibold)",
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
              or
            </Typography>
          </>
        )}

        <input
          type="file"
          id="file-input"
          onChange={onFileSelect}
          style={{ display: "none" }}
        />
        <label htmlFor="file-input">
          <Button
            component="span"
            variant="contained"
            startIcon={<FolderOpenOutlined />}
            sx={{
              backgroundColor: "var(--primary-blue)",
              color: "white",
              padding: "14px 32px",
              borderRadius: "var(--radius-md)",
              fontSize: "16px",
              fontWeight: "var(--font-weight-semibold)",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(26, 115, 232, 0.3)",
              transition: "all var(--transition-fast)",
              "&:hover": {
                backgroundColor: "#0D47A1",
                transform: "scale(1.03)",
                boxShadow: "0 6px 16px rgba(26, 115, 232, 0.4)",
              },
            }}
          >
            Select File
          </Button>
        </label>
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
};

export default FileUploadZone;
