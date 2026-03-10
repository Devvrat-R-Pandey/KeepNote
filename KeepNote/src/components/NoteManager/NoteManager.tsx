import React, { useContext, useEffect, useState, useCallback } from "react";
import NoteList from "../NoteList/NoteList";
import AdvancedNoteSearch from "../AdvancedNoteSearch/AdvancedNoteSearch";
import AddNoteForm from "../AddNoteForm/AddNoteForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import styles from "./NoteManager.module.css";

import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Collapse,
  IconButton,
  CircularProgress,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import { useSnackbar } from "../../context/SnackbarContext";

import type { Note } from "../../types/Note";

import { fetchNotes, addNote, deleteNote } from "../../services/noteService";

interface Props {
  viewMode: "basic" | "advanced";
  searchTerm: string;
}

const NoteManager: React.FC<Props> = ({ viewMode, searchTerm }) => {
  const { state, dispatch } = useContext(AppContext);
  const { showSnackbar } = useSnackbar();
  const location = useLocation();

  const [showAddNote, setShowAddNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastCriteria, setLastCriteria] = useState<{ category: string; priority: string }>({
    category: "",
    priority: "",
  });

  /* ---------------- Fetch Notes ---------------- */

  useEffect(() => {
    const controller = new AbortController();

    const loadNotes = async () => {
      try {
        const data = await fetchNotes(controller.signal);

        dispatch({
          type: "SET_NOTES",
          payload: data,
        });

        setLoading(false);
      } catch (err: any) {
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") return;

        console.error("Failed to fetch notes:", err.message);

        showSnackbar(err?.message || "Failed to load notes", "error");

        setLoading(false);
      }
    };

    loadNotes();

    return () => controller.abort();
  }, [dispatch, showSnackbar]);

  /* ---------------- Basic Search ---------------- */

  useEffect(() => {
    dispatch({
      type: "FILTER_BASIC",
      payload: searchTerm,
    });
  }, [searchTerm, dispatch]);

  /* ---------------- Advanced Search ---------------- */

  const handleAdvancedFilter = useCallback(
    (criteria: any) => {
      if (criteria.__clear || criteria.__empty) {
        dispatch({ type: "FILTER_ADVANCED", payload: criteria });
        setLastCriteria({ category: "", priority: "" });
        return;
      }

      const newCriteria = {
        category: criteria.category?.trim().toLowerCase() || "",
        priority: criteria.priority?.trim().toLowerCase() || "",
      };

      const hasCriteriaChanged =
        newCriteria.category !== lastCriteria.category ||
        newCriteria.priority !== lastCriteria.priority;

      if (hasCriteriaChanged) {
        dispatch({ type: "FILTER_ADVANCED", payload: criteria });
        setLastCriteria(newCriteria);
      }
    },
    [dispatch, lastCriteria],
  );

  /* ---------------- Add Note ---------------- */

  const handleAddNote = async (note: Omit<Note, "id">) => {
    try {
      const savedNote = await addNote(note, state.notes.notes);

      dispatch({
        type: "ADD_NOTE",
        payload: savedNote,
      });

      showSnackbar("Note added successfully!");

      setShowAddNote(false);
    } catch (err: any) {
      console.error("Failed to add note:", err.message);

      showSnackbar(err?.message || "Failed to add note", "error");
    }
  };

  /* ---------------- Delete Note ---------------- */

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);

      dispatch({
        type: "DELETE_NOTE",
        payload: { id },
      });

      showSnackbar("Note deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete note:", err.message);

      showSnackbar(err?.message || "Failed to delete note", "error");
    }
  };

  /* ---------------- Sort ---------------- */

  const handleSortChange = (value: string) => {
    dispatch({
      type: "SET_SORT",
      payload: value,
    });
  };

  /* ---------------- Navigation Snackbar ---------------- */

  useEffect(() => {
    if (!location.state) return;

    const navState: any = location.state;

    if (navState.snackbarMessage) showSnackbar(navState.snackbarMessage);

    if (navState.showSaved) showSnackbar("Notecard saved successfully!");

    if (navState.showDeleted) showSnackbar("Note deleted successfully!");

    window.history.replaceState({}, document.title);
  }, [location.state, showSnackbar]);

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <main style={{ overflowY: "auto", overflowX: "hidden", height: "100vh" }}>
      {viewMode === "basic" && (
        <>
          <Box textAlign="center" mt={1}>
            <Paper
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 1,
                maxWidth: 450,
                mx: "auto",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                sx={{ cursor: "pointer" }}
                onClick={() => setShowAddNote((prev) => !prev)}
              >
                <Typography fontWeight={600}>Add Note Details</Typography>

                <IconButton size="small">
                  <ExpandMoreIcon
                    sx={{
                      transform: showAddNote
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "0.3s",
                    }}
                  />
                </IconButton>
              </Box>

              <Collapse in={showAddNote}>
                <Box mt={1}>
                  <AddNoteForm onAddNote={handleAddNote} />
                </Box>
              </Collapse>
            </Paper>
          </Box>

          <Box textAlign="center" mt={2} mb={2}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Checklist Chronicles: Conquering Tasks One Tick at a Time
            </Typography>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={state.notes.sortBy}
                displayEmpty
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <MenuItem value="">Sort by</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {state.notes.filteredNotes.length > 0 ? (
            <div className={styles.noteListWrapper}>
              <NoteList
                notes={state.notes.filteredNotes}
                onDelete={handleDeleteNote}
              />
            </div>
          ) : (
            <ErrorMessage
              type="info"
              message="No notes available. Start by adding a new note!"
            />
          )}
        </>
      )}

      {viewMode === "advanced" && (
        <>
          <AdvancedNoteSearch
            notes={state.notes.notes}
            onFilter={handleAdvancedFilter}
            searchesPerformed={state.notes.searchesPerformed}
            searchUrl={state.notes.searchUrl}
          />

          {state.notes.hasSearched && (
            <>
              <Box textAlign="center" mt={2} mb={2}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Checklist Chronicles: Conquering Tasks One Tick at a Time
                </Typography>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={state.notes.sortBy}
                    displayEmpty
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <MenuItem value="">Sort by</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {state.notes.advancedFilteredNotes.length > 0 ? (
                <div className={styles.noteListWrapper}>
                  <NoteList
                    notes={state.notes.advancedFilteredNotes}
                    onDelete={handleDeleteNote}
                  />
                </div>
              ) : (
                state.notes.errorMessage && (
                  <ErrorMessage
                    type="info"
                    message={state.notes.errorMessage}
                  />
                )
              )}
            </>
          )}
        </>
      )}
    </main>
  );
};

export default NoteManager;