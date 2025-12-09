import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./App.css";
import Sidebar from "./modules/Sidebar/Sidebar";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
