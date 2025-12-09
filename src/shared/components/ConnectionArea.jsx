import { QrCode2Outlined, SendOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ConnectionArea = ({ onConnect }) => {
  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "32px",
        padding: "32px",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--white)",
        border: "1px solid var(--border-light)",
        boxShadow: "0 2px 8px var(--shadow-sm)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "var(--text-dark)",
          fontWeight: "var(--font-weight-semibold)",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        Waiting for connection...
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            padding: "24px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--soft-background)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <QrCode2Outlined
            sx={{ fontSize: 80, color: "var(--primary-blue)" }}
          />
          <Typography
            sx={{
              color: "#5F6368",
              fontSize: "14px",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Scan to connect
          </Typography>
        </Box>

        <Typography
          sx={{ color: "#5F6368", fontWeight: "var(--font-weight-medium)" }}
        >
          or
        </Typography>

        <Button
          variant="contained"
          startIcon={<SendOutlined />}
          onClick={onConnect}
          sx={{
            backgroundColor: "var(--success-accent)",
            color: "var(--text-dark)",
            padding: "14px 32px",
            borderRadius: "var(--radius-md)",
            fontSize: "16px",
            fontWeight: "var(--font-weight-semibold)",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(75, 227, 193, 0.3)",
            transition: "all var(--transition-fast)",
            "&:hover": {
              backgroundColor: "#3DD4B3",
              transform: "scale(1.03)",
              boxShadow: "0 6px 16px rgba(75, 227, 193, 0.4)",
            },
          }}
        >
          Connect to Receiver
        </Button>
      </Box>
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
