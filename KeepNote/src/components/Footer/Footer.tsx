import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <AppBar
      component="footer"
      position="static"
      sx={{
        top: "auto",
        bottom: 0,
        background: "var(--header-bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "20px",
          px: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "var(--muted)" }}
        >
          © 2024 Keep Note — All rights reserved
        </Typography>

        {/* Social links */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            component="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            sx={{ color: "var(--muted)", p: 0.25 }}
          >
            <FaFacebook aria-hidden="true" />
          </IconButton>

          <IconButton
            component="a"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            sx={{ color: "var(--muted)", p: 0.25 }}
          >
            <FaInstagram aria-hidden="true" />
          </IconButton>

          <IconButton
            component="a"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            sx={{ color: "var(--muted)", p: 0.25 }}
          >
            <FaLinkedin aria-hidden="true" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
