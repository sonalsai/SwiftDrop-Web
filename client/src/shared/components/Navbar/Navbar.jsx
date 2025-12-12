import { Menu as MenuIcon, Close } from "@mui/icons-material";
import logo from "../../../assets/images/logo.png";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "History", path: "/history" },
    { label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // At the top, always show
      if (currentScrollY <= 0) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN -> Show
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP -> Hide
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", padding: "20px" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img
            src={logo}
            alt="SwiftDrop"
            style={{ width: "36px", height: "36px" }}
          />
          <Typography
            variant="h6"
            sx={{
              background:
                "linear-gradient(135deg, var(--text-dark) 0%, #3e4e68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "var(--font-primary)",
              fontWeight: 800,
            }}
          >
            SwiftDrop
          </Typography>
        </Box>

        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: "var(--text-secondary)" }}
        >
          <Close />
        </IconButton>
      </Box>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                textAlign: "center",
                borderRadius: "12px",
                backgroundColor: isActive(item.path)
                  ? "rgba(13, 71, 161, 0.08)"
                  : "transparent",
                color: isActive(item.path)
                  ? "var(--primary-blue)"
                  : "var(--text-dark)",
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(230, 235, 240, 0.6)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        transition: "transform 0.3s ease-in-out",
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: { xs: "12px 16px", md: "16px 32px" }, // Responsive Padding
          maxWidth: "1440px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/home")}
          sx={{
            display: "flex",
            alignItems: "center",
            // gap: "4px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <img
            src={logo}
            alt="SwiftDrop"
            style={{ width: "42px", height: "42px" }}
          />
          <Typography
            variant="h5"
            sx={{
              background:
                "linear-gradient(135deg, var(--text-dark) 0%, #3e4e68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "var(--font-primary)",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            SwiftDrop
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: "8px",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            padding: "6px",
            borderRadius: "50px",
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  padding: "10px 24px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  backgroundColor: active ? "white" : "transparent",
                  boxShadow: active ? "0 4px 12px rgba(0, 0, 0, 0.05)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: active ? "white" : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: active
                      ? "var(--primary-blue)"
                      : "var(--text-secondary)",
                    fontWeight: active ? 700 : 500,
                    fontSize: "15px",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Mobile Hamburger Menu */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon sx={{ color: "var(--text-dark)" }} />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            borderRadius: "20px 0 0 20px",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
