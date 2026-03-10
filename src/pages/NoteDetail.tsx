import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Note } from "../types/Note";
import { useSnackbar } from "../context/SnackbarContext";

import {
  Box,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:3000/notes";

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      setNote(res.data);
    });
  }, [id]);

  const handleSave = async () => {
    if (!note) return;

    try {
      await axios.put(`${API_URL}/${id}`, note);

      showSnackbar("Notecard saved successfully", "success");

      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save note", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      showSnackbar("Note deleted successfully", "error");

      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete note", "error");
    }
  };

  if (!note) return null;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 420,
          padding: 3,
          borderRadius: 2,
          backgroundColor: "#e9edf1",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Note
        </Typography>

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
          onChange={(e) =>
            setNote({ ...note, description: e.target.value })
          }
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
          value={note.priority}
          onChange={(e) =>
            setNote({
              ...note,
              priority: e.target.value as Note["priority"],
            })
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
            setNote({
              ...note,
              status: e.target.value as Note["status"],
            })
          }
        >
          <MenuItem value="yet-to-start">Yet To Start</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        {/* ACTION BUTTONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 2,
          }}
        >
          <IconButton
            onClick={handleSave}
            sx={{
              backgroundColor: "#22c55e",
              color: "#fff",
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            <SaveIcon />
          </IconButton>

          <IconButton
            onClick={() => setConfirmOpen(true)}
            sx={{
              backgroundColor: "#ef4444",
              color: "#fff",
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this note?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoteDetail;