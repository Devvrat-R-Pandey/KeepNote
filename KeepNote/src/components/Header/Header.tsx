import React, { useContext } from "react";
import { IconButton } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import styles from "./Header.module.css";

interface Props {
  searchTerm: string;
  setSearchTerm: (query: string) => void;
  onSearch: (query: string) => void;
  viewMode: "basic" | "advanced";
  toggleButton: React.ReactNode;
  isLoggedIn: boolean;
}

const Header: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  viewMode,
  toggleButton,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      {/* LEFT — logo */}
      <span
        className={`${styles.logoText} ${!isLoggedIn ? styles.noClick : ""}`}
        onClick={() => isLoggedIn && navigate("/home")}
      >
        KEEPNOTE
      </span>

      {/* CENTER — search + toggle */}
      <div className={styles.center}>
        {isLoggedIn && viewMode === "basic" && (
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={handleChange}
            />
            {searchTerm && (
              <IconButton onClick={handleClear} className={styles.clearBtn}>
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        )}
        {isLoggedIn && toggleButton}
      </div>

      {/* RIGHT — nav icons + auth */}
      <div className={styles.right}>
        {isLoggedIn && (
          <IconButton color="inherit" onClick={() => navigate("/home")}>
            <HomeIcon />
          </IconButton>
        )}
        {isLoggedIn && (
          <IconButton color="inherit" onClick={() => navigate("/profile")}>
            <PersonIcon />
          </IconButton>
        )}

        {isLoggedIn ? (
          <div className={styles.authBtn} onClick={handleLogout}>
            <LoginIcon />
            <span className={styles.authLabel}>LOGOUT</span>
          </div>
        ) : (
          <div className={styles.authBtn} onClick={() => navigate("/login")}>
            <LoginIcon />
            <span className={styles.authLabel}>LOGIN</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
