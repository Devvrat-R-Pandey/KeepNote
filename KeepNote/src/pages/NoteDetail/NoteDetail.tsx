import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Note } from "../../types/Note";
import { useSnackbar } from "../../hooks/useSnackbar";

import {
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./NoteDetail.module.css";

const API_URL = "http://localhost:3000/notes";

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${API_URL}/${id}`, { signal: controller.signal, timeout: 5000 })
      .then((res) => {
        setNote(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error(err);
        showSnackbar("Failed to load note", "error");
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const handleSave = async () => {
    if (!note) return;
    try {
      await axios.put(`${API_URL}/${id}`, note, { timeout: 5000 });
      showSnackbar("Notecard saved successfully", "success");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save note", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`, { timeout: 5000 });
      showSnackbar("Note deleted successfully", "success");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete note", "error");
    }
  };

  if (loading) {
    return (
      <div className={styles.centered}>
        <CircularProgress />
      </div>
    );
  }

  if (!note) {
    return (
      <div className={styles.centered}>
        <Typography color="error">Note not found.</Typography>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Note</h2>

        <TextField
          label="Title"
          fullWidth
          margin="dense"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          margin="dense"
          value={note.description}
          onChange={(e) => setNote({ ...note, description: e.target.value })}
        />

        <TextField
          label="Category"
          fullWidth
          margin="dense"
          value={note.category}
          disabled
        />

        <TextField
          select
          label="Priority"
          fullWidth
          margin="dense"
          value={note.priority ?? ""}
          onChange={(e) =>
            setNote({ ...note, priority: e.target.value as Note["priority"] })
          }
        >
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          fullWidth
          margin="dense"
          value={note.status}
          onChange={(e) =>
            setNote({ ...note, status: e.target.value as Note["status"] })
          }
        >
          <MenuItem value="yet-to-start">Yet To Start</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        {/* Action buttons */}
        <div className={styles.actions}>
          <IconButton onClick={handleSave} aria-label="Save note" className={styles.saveBtn}>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={() => setConfirmOpen(true)} aria-label="Delete note" className={styles.deleteBtn}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      {/* Confirm delete dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this note?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NoteDetail;
