import React, { useState } from "react";
import type { Note, Status, Priority } from "../../types/Note";

// MUI Components
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";

interface AddNoteFormProps {
  onAddNote: (note: Omit<Note, "id">) => void;
  onSuccess?: () => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ onAddNote, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [status, setStatus] = useState<Status>("yet-to-start");

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    status?: string;
  }>({});

  // 🔥 Realtime validation
  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "title" && value.trim().length < 3) {
      error = "Title must be at least 3 characters";
    }
    if (name === "description" && value.trim().length < 5) {
      error = "Description must be at least 5 characters";
    }
    if (name === "category" && !value.trim()) {
      error = "Category is required";
    }
    if (name === "status" && !value) {
      error = "Status is required";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation check
    validateField("title", title);
    validateField("description", description);
    validateField("category", category);
    validateField("status", status);

    if (Object.values(errors).some((err) => err)) return;

    const newNote: Omit<Note, "id"> = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority: priority || undefined,
      status,
    };

    onAddNote(newNote);
    resetForm();
    if (onSuccess) onSuccess();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("");
    setStatus("yet-to-start");
    setErrors({});
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              validateField("title", e.target.value);
            }}
            required
            InputLabelProps={{ required: true }}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              validateField("description", e.target.value);
            }}
            required
            InputLabelProps={{ required: true }}
            error={!!errors.description}
            helperText={errors.description}
          />

          {/* ✅ Category + Priority side by side */}
          <Box display="flex" gap={2}>
            <TextField
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                validateField("category", e.target.value);
              }}
              required
              InputLabelProps={{ required: true }}
              fullWidth
              error={!!errors.category}
              helperText={errors.category}
            />
            <FormControl fullWidth>
              <InputLabel required>Select Priority</InputLabel>
              <Select
                value={priority}
                label="Select Priority"
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth error={!!errors.status}>
            <InputLabel required>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value as Status);
                validateField("status", e.target.value);
              }}
            >
              <MenuItem value="yet-to-start">Yet To Start</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          {errors.status && (
            <Box sx={{ color: "error.main", fontSize: 12, mt: 0.5 }}>
              {errors.status}
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              RESET
            </Button>
            <Button variant="contained" color="primary" type="submit">
              ADD NOTE
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddNoteForm;