import React from "react";
import IconButton from "@mui/material/IconButton";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Copyright */}
      <p className={styles.copyright}>© 2024 Keep Note — All rights reserved</p>

      {/* Social links */}
      <div className={styles.socialRow}>
        <IconButton
          component="a"
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className={styles.socialIcon}
        >
          <FaFacebook aria-hidden="true" />
        </IconButton>

        <IconButton
          component="a"
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={styles.socialIcon}
        >
          <FaInstagram aria-hidden="true" />
        </IconButton>

        <IconButton
          component="a"
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={styles.socialIcon}
        >
          <FaLinkedin aria-hidden="true" />
        </IconButton>
      </div>
    </footer>
  );
};

export default Footer;
