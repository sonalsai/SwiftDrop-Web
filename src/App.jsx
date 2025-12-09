import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Outlet />
    </Box>
  );
}

export default App;
