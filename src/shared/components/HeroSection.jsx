import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const HeroSection = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "64px 32px 32px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "var(--text-dark)",
          fontFamily: "var(--font-primary)",
          fontWeight: "var(--font-weight-bold)",
          letterSpacing: "-1px",
          marginBottom: "16px",
          fontSize: { xs: "2.5rem", md: "3.5rem" },
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
          lineHeight: 1.6,
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
