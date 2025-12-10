import { SendOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "History", path: "/history" },
    { label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border-light)",
        boxShadow: "0 2px 8px var(--shadow-sm)",
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, var(--primary-blue) 0%, #0D47A1 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        >
          <SendOutlined
            sx={{ color: "white", fontSize: 24, transform: "rotate(-45deg)" }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            color: "var(--text-dark)",
            fontFamily: "var(--font-primary)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "-0.5px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        >
          SwiftDrop
        </Typography>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {navItems.map((item) => (
          <Typography
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              color: isActive(item.path)
                ? "var(--primary-blue)"
                : "var(--text-dark)",
              fontWeight: isActive(item.path)
                ? "var(--font-weight-semibold)"
                : "var(--font-weight-medium)",
              cursor: "pointer",
              transition: "var(--transition-fast)",
              "&:hover": {
                color: isActive(item.path) ? "#0D47A1" : "var(--primary-blue)",
              },
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Navbar;
