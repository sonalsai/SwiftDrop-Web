import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Navbar } from "../shared/components";

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--background-color)",
      }}
    >
      <Navbar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
