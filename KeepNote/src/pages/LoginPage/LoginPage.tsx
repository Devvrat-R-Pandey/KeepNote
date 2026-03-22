import React, { useState, useContext } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useSnackbar } from "../../hooks/useSnackbar";
import styles from "./LoginPage.module.css";

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
      const response = await axios.get<ApiUser[]>(API_URL, { timeout: 5000 });
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          showSnackbar("Login request timed out. Please try again.", "error");
          return;
        }
        if (err.response) {
          showSnackbar("Server error. Please try again later.", "error");
          return;
        }
      }
      console.error(err);
      showSnackbar("Unable to login. Check server.", "error");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login to KeepNote</h2>

        <TextField
          placeholder="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.field}
        />

        <TextField
          placeholder="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={styles.fieldLast}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          className={styles.loginBtn}
        >
          LOGIN
        </Button>

        <p className={styles.signupText}>
          New user?{" "}
          <span className={styles.signupLink} onClick={() => navigate("/register")}>
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;