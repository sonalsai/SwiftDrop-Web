import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box>
      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          height: "100dvh",
          backgroundColor: "var(--background-color)",
          flexDirection: "row",
        }}
      >
        <Typography variant="h3" color="var(--primary-color)"></Typography>
      </Box>
    </Box>
  );
};

export default Home;
