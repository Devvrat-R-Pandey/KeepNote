import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./PageNotFound.module.css";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.heading}>Page not found</h2>
      <p className={styles.subtext}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/home")}
        className={styles.homeBtn}
      >
        Go Home
      </Button>
    </div>
  );
};

export default PageNotFound;
