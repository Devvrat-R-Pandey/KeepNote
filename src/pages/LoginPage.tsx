import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useSnackbar } from "../context/SnackbarContext";

const API_URL = "http://localhost:3000/users";

interface ApiUser {
  id: string | number;
  email: string;
  password: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const { showSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email || !password) {
      showSnackbar("Please enter email and password", "warning");
      return;
    }

    try {

      const response = await axios.get<ApiUser[]>(API_URL, {
        timeout: 5000,
      });

      const users = response.data;

      const matchedUser = users.find(
        (user) =>
          user.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          user.password.trim() === password.trim()
      );

      if (!matchedUser) {
        showSnackbar("Invalid email or password", "error");
        return;
      }

      dispatch({
        type: "LOGIN",
        payload: {
          userId: Number(matchedUser.id),
          user: {
            id: Number(matchedUser.id),
            email: matchedUser.email,
            firstName: matchedUser.firstName,
            lastName: matchedUser.lastName,
            phone: matchedUser.phone,
          },
        },
      });

      navigate("/home");
      showSnackbar("You have logged in successfully!", "success");

    } catch (err: any) {

      if (err.code === "ECONNABORTED") {
        showSnackbar("Login request timed out. Please try again.", "error");
        return;
      }

      if (err.response) {
        showSnackbar("Server error. Please try again later.", "error");
        return;
      }

      console.error(err);
      showSnackbar("Unable to login. Check server.", "error");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1f22",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 360,
          p: 4,
          borderRadius: 2,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={3}>
          Login to KeepNote
        </Typography>

        <TextField
          placeholder="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2.5 }}
        />

        <TextField
          placeholder="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            backgroundColor: "#f2b01e",
            fontWeight: 700,
            py: 1.2,
            mb: 2,
            "&:hover": { backgroundColor: "#d99a18" },
          }}
        >
          LOGIN
        </Button>

        <Typography fontSize={13}>
          New user?{" "}
          <span
            style={{ color: "#f2b01e", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/register")}
          >
            Sign up here
          </span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;