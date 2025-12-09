import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const StepIndicator = ({ steps, activeStep }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
        marginTop: "48px",
        gap: "24px",
      }}
    >
      {steps.map((item, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            padding: "24px",
            borderRadius: "var(--radius-md)",
            backgroundColor:
              index === activeStep ? "var(--soft-background)" : "transparent",
            transition: "var(--transition-fast)",
            "&:hover": {
              backgroundColor: "var(--soft-background)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <Box
            sx={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor:
                index === activeStep
                  ? "var(--primary-blue)"
                  : "var(--border-light)",
              color: index === activeStep ? "white" : "#5F6368",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "var(--font-weight-bold)",
              fontSize: "20px",
              transition: "var(--transition-fast)",
            }}
          >
            {item.step}
          </Box>
          <Typography
            sx={{
              color: index === activeStep ? "var(--text-dark)" : "#5F6368",
              fontWeight:
                index === activeStep
                  ? "var(--font-weight-semibold)"
                  : "var(--font-weight-medium)",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {item.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      step: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.element,
    })
  ).isRequired,
  activeStep: PropTypes.number,
};

StepIndicator.defaultProps = {
  activeStep: 0,
};

export default StepIndicator;
