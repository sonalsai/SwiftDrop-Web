import { History, Home, Person } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        width: "5%",
        height: "100dvh",
        backgroundColor: "var(--secondary-color)  ",
        padding: "32px 0",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack>
        <Tooltip title="Home" enterDelay={800} placement="right">
          <IconButton
            aria-label="Home"
            size="large"
            sx={{ width: 52, height: 52 }}
            onClick={() => navigate("/home")}
          >
            <Home sx={{ fontSize: 52, color: "#F2F5F9" }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="History" enterDelay={800} placement="right">
          <IconButton
            aria-label="History"
            size="large"
            sx={{ width: 52, height: 52 }}
            onClick={() => navigate("/history")}
          >
            <History sx={{ fontSize: 52, color: "#F2F5F9" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack>
        <Tooltip title="Profile" enterDelay={800} placement="right">
          <IconButton
            aria-label="Profile"
            size="large"
            sx={{ width: 52, height: 52 }}
            onClick={() => navigate("/profile")}
          >
            <Person sx={{ fontSize: 52, color: "#F2F5F9" }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
