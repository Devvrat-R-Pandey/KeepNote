import React, { useState } from "react";
import type { Note, Status, Priority } from "../../types/Note";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  FormHelperText,
} from "@mui/material";
import styles from "./AddNoteForm.module.css";

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

  const validateField = (name: string, value: string): string => {
    if (name === "title" && value.trim().length < 3)
      return "Title must be at least 3 characters";
    if (name === "description" && value.trim().length < 5)
      return "Description must be at least 5 characters";
    if (name === "category" && !value.trim())
      return "Category is required";
    if (name === "status" && !value)
      return "Status is required";
    return "";
  };

  const handleBlurValidation = (name: string, value: string) => {
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: validateField("title", title),
      description: validateField("description", description),
      category: validateField("category", category),
      status: validateField("status", status),
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    onAddNote({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      priority: priority || undefined,
      status,
    });

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
    <div className={styles.wrapper}>
      <Paper elevation={3} className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => handleBlurValidation("title", e.target.value)}
            required
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => handleBlurValidation("description", e.target.value)}
            required
            error={!!errors.description}
            helperText={errors.description}
          />

          <div className={styles.row}>
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onBlur={(e) => handleBlurValidation("category", e.target.value)}
              required
              fullWidth
              error={!!errors.category}
              helperText={errors.category}
            />
            <FormControl fullWidth>
              <InputLabel>Select Priority</InputLabel>
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
          </div>

          <FormControl fullWidth error={!!errors.status}>
            <InputLabel required>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => {
                setStatus(e.target.value as Status);
                handleBlurValidation("status", e.target.value);
              }}
            >
              <MenuItem value="yet-to-start">Yet To Start</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
          </FormControl>

          <div className={styles.btnRow}>
            <Button variant="outlined" color="secondary" onClick={resetForm} type="button">
              RESET
            </Button>
            <Button variant="contained" color="primary" type="submit">
              ADD NOTE
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default AddNoteForm;