import { SendOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
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
          padding: "16px 32px",
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
            gap: "12px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Box
            sx={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, var(--primary-blue) 0%, #0D47A1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(26, 115, 232, 0.3)",
            }}
          >
            <SendOutlined
              sx={{
                color: "white",
                fontSize: 22,
                transform: "rotate(-45deg) translate(2px, 0)",
              }}
            />
          </Box>
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

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
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
      </Box>
    </Box>
  );
};

export default Navbar;
