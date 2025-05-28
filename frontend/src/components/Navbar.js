"use client";

import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { isAdminAuthenticated, logoutAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin-login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px: 2,
        py: 1,
        boxShadow: 1,
        bgcolor: "background.paper",
      }}
    >
      {/* 👈 LEFT SIDE */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          DevNotify
        </Typography>
        <Button onClick={() => navigate("/")}>Home</Button>
        <Button onClick={() => navigate("/events")}>Events</Button>
        <Button onClick={() => navigate("/about")}>About</Button>
        <Button onClick={() => navigate("/contact")}>Contact</Button>
        <Button onClick={() => navigate("/profile")}>Profile</Button>
      </Box>

      {/* 👉 RIGHT SIDE */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {isAdminAuthenticated ? (
          <>
            <Button onClick={() => navigate("/admin")}>Admin Panel</Button>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button onClick={() => navigate("/admin-login")}>Admin</Button>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
