import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "../context/SnackbarContext";
import { AppContext } from "../context/AppContext";

const API_URL = "http://localhost:3000/users";

interface ApiUser {
  id: number | string;
  email: string;
  phone: string;
  password: string;
}

const UserProfile: React.FC = () => {
  const [userId, setUserId] = useState<number | string | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const { showSnackbar } = useSnackbar();
  const { dispatch } = useContext(AppContext);

  /* -------------------- Load Logged-in User -------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) return;

    const user: ApiUser = JSON.parse(storedUser);
    setUserId(user.id);
    setEmail(user.email);
    setPhone(user.phone);
  }, []);

  /* -------------------- Update Profile -------------------- */
const handleUpdateProfile = async () => {
  if (!userId) return;

  try {
    const { data: user }: { data: ApiUser } = await axios.get(`${API_URL}/${userId}`);

    if (newPassword) {
      if (!oldPassword) {
        setOldPasswordError("Please enter old password");
        return;
      }

      if (oldPassword !== user.password) {
        setOldPasswordError("Old password is incorrect");
        return;
      }
    }

    setOldPasswordError("");

    if (!email.includes("@")) {
      showSnackbar("Invalid email format", "error");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      showSnackbar("Phone must be 10 digits", "error");
      return;
    }

    const updatedUser: ApiUser = {
      id: userId,
      email: email.trim(),
      phone: phone.trim(),
      password: newPassword ? newPassword.trim() : user.password,
    };

    await axios.patch(`${API_URL}/${userId}`, updatedUser, {
      timeout: 5000
    });

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    dispatch({
      type: "LOGIN",
      payload: { userId: updatedUser.id, user: updatedUser }
    });

    showSnackbar("Profile updated successfully", "success");

    setOldPassword("");
    setNewPassword("");

  } catch (error: any) {

    if (axios.isCancel(error) || error?.code === "ERR_CANCELED") {
      return;
    }

    console.error(error);
    showSnackbar("Failed to update profile", "error");
  }
};

  /* -------------------- UI -------------------- */
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1e1f22",
        px: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 320,
          borderRadius: 2,
          backgroundColor: "#fff",
          px: 2,
          py: 3
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={600}
          mb={2}
          textAlign="center"
        >
          Update Profile
        </Typography>

        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Old Password"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={!!oldPasswordError}
          helperText={oldPasswordError}
          sx={{ mb: 2 }}
        />

        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleUpdateProfile}
          sx={{
            backgroundColor: "#f2b01e",
            fontWeight: 700,
            py: 1,
            "&:hover": { backgroundColor: "#d99a18" }
          }}
        >
          UPDATE PROFILE
        </Button>
      </Paper>
    </Box>
  );
};

export default UserProfile;