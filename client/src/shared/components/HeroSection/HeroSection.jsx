import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const HeroSection = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "24px 32px 16px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        marginTop: "16px",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "var(--text-dark)",
          fontFamily: "var(--font-primary)",
          fontWeight: "var(--font-weight-bold)",
          letterSpacing: "-1px",
          marginBottom: "8px",
          fontSize: { xs: "2rem", md: "2.5rem" },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: "#5F6368",
          fontWeight: "var(--font-weight-normal)",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.5,
          fontSize: "1rem",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default HeroSection;
