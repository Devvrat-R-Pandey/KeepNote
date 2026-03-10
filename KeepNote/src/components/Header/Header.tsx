import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; // ✅ import global context

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
  const { dispatch } = useContext(AppContext); // ✅ use reducer dispatch

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
    // ✅ Clear auth state and localStorage
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const renderSearchField = () => (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search notes..."
      value={searchTerm}
      onChange={handleChange}
      sx={{
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
          fontSize: 14,
          fontWeight: 500,
        },
      }}
      InputProps={{
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <AppBar position="static" sx={{ background: "var(--header-bg)" }}>
      <Toolbar sx={{ position: "relative", justifyContent: "space-between" }}>
        {/* LEFT */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 1.2,
            color: "skyblue",
            cursor: isLoggedIn ? "pointer" : "default",
          }}
          onClick={() => isLoggedIn && navigate("/home")}
        >
          KEEPNOTE
        </Typography>

        {/* CENTER */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {isLoggedIn && viewMode === "basic" && renderSearchField()}
          {isLoggedIn && toggleButton}
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={handleLogout}
            >
              <LoginIcon />
              <Typography
                sx={{
                  ml: 0.5,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                LOGOUT
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              <LoginIcon />
              <Typography
                sx={{
                  ml: 0.5,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                LOGIN
              </Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;