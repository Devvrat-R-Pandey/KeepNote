import React, { useState, useContext } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "../../hooks/useSnackbar";
import { AppContext } from "../../context/AppContext";
import styles from "./UserProfile.module.css";

const API_URL = "http://localhost:3000/users";

interface ApiUser {
  id: number | string;
  email: string;
  phone: string;
  password: string;
}

function getStoredUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem("loggedInUser");
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

const UserProfile: React.FC = () => {
  const storedUser = getStoredUser();

  const [userId] = useState<number | string | null>(storedUser?.id ?? null);
  const [email, setEmail] = useState(storedUser?.email ?? "");
  const [phone, setPhone] = useState(storedUser?.phone ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const { showSnackbar } = useSnackbar();
  const { dispatch } = useContext(AppContext);

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

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showSnackbar("Please enter a valid email address", "error");
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

      await axios.patch(`${API_URL}/${userId}`, updatedUser, { timeout: 5000 });
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      dispatch({ type: "LOGIN", payload: { userId: updatedUser.id, user: updatedUser } });
      showSnackbar("Profile updated successfully", "success");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      if (axios.isCancel(error) || (error instanceof Error && error.message === "canceled")) return;
      console.error(error);
      showSnackbar("Failed to update profile", "error");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Update Profile</h2>

        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.field}
        />

        <TextField
          label="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.field}
        />

        <TextField
          label="Old Password"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={!!oldPasswordError}
          helperText={oldPasswordError}
          className={styles.field}
        />

        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.fieldLast}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleUpdateProfile}
          className={styles.submitBtn}
        >
          UPDATE PROFILE
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;