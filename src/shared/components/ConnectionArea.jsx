import { SendOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ConnectionArea = ({ onConnect }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "424px",
        padding: "64px 48px",
        borderRadius: "20px",
        backgroundColor: "#F9FBFF",
        border: "2px dashed #D8E3F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.3s ease",
        "&:hover": {
          borderColor: "#AAC8E8",
          backgroundColor: "#F4F8FF",
        },
      }}
    >
      {/* Large Icon */}
      <Box
        sx={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "#4be3c12e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          transition: "0.3s ease",
          "&:hover": {
            transform: "scale(1.08)",
            background: "#4be3c147",
          },
        }}
      >
        <SendOutlined sx={{ fontSize: "40px", color: "#0B1B36" }} />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          color: "#0B1B36",
          fontWeight: 600,
          marginBottom: "8px",
          fontSize: "20px",
        }}
      >
        Connect to Receiver
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          color: "#6A7B91",
          marginBottom: "32px",
          fontSize: "15px",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Enter the connection code shared by the receiver to start the secure P2P
        session.
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        startIcon={<SendOutlined />}
        onClick={onConnect}
        sx={{
          background: "linear-gradient(90deg, #4be3c1 0%, #37d7b1 100%)",
          color: "#0b1b36",
          padding: "14px 34px",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 4px 14px rgba(75, 227, 193, 0.35)",
          transition: "0.25s ease",
          "&:hover": {
            background: "#37d7b1",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 18px rgba(75, 227, 193, 0.45)",
          },
        }}
      >
        Enter connection code
      </Button>
    </Box>
  );
};

ConnectionArea.propTypes = {
  onConnect: PropTypes.func,
};

ConnectionArea.defaultProps = {
  onConnect: () => console.log("Connect button clicked"),
};

export default ConnectionArea;
