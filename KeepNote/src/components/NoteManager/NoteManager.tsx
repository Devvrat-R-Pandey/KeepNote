import React, { useContext, useEffect, useState, useCallback } from "react";
import NoteList from "../NoteList/NoteList";
import AdvancedNoteSearch from "../AdvancedNoteSearch/AdvancedNoteSearch";
import AddNoteForm from "../AddNoteForm/AddNoteForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import styles from "./NoteManager.module.css";

import {
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
import { useSnackbar } from "../../hooks/useSnackbar";
import type { Note } from "../../types/Note";
import { fetchNotes, addNote, deleteNote } from "../../services/noteService";

interface Props {
  viewMode: "basic" | "advanced";
  searchTerm: string;
}

interface FilterCriteria {
  category?: string;
  priority?: string;
  __clear?: boolean;
  __empty?: boolean;
}

interface NavState {
  snackbarMessage?: string;
  showSaved?: boolean;
  showDeleted?: boolean;
}

const NoteManager: React.FC<Props> = ({ viewMode, searchTerm }) => {
  const { state, dispatch } = useContext(AppContext);
  const { showSnackbar } = useSnackbar();
  const location = useLocation();

  const [showAddNote, setShowAddNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastCriteria, setLastCriteria] = useState<{
    category: string;
    priority: string;
  }>({
    category: "",
    priority: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadNotes = async () => {
      try {
        const data = await fetchNotes(controller.signal);
        dispatch({ type: "SET_NOTES", payload: data });
        setLoading(false);
      } catch (err) {
        if (
          err instanceof Error &&
          (err.name === "AbortError" || err.message === "canceled")
        )
          return;
        const message =
          err instanceof Error ? err.message : "Failed to load notes";
        console.error("Failed to fetch notes:", message);
        showSnackbar(message, "error");
        setLoading(false);
      }
    };

    loadNotes();
    return () => controller.abort();
  }, [dispatch, showSnackbar]);

  useEffect(() => {
    dispatch({ type: "FILTER_BASIC", payload: searchTerm });
  }, [searchTerm, dispatch]);

  const handleAdvancedFilter = useCallback(
    (criteria: FilterCriteria) => {
      if (criteria.__clear || criteria.__empty) {
        dispatch({ type: "FILTER_ADVANCED", payload: criteria });
        setLastCriteria({ category: "", priority: "" });
        return;
      }

      const newCriteria = {
        category: criteria.category?.trim().toLowerCase() ?? "",
        priority: criteria.priority?.trim().toLowerCase() ?? "",
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

  const handleAddNote = async (note: Omit<Note, "id">) => {
    try {
      const savedNote = await addNote(note);
      dispatch({ type: "ADD_NOTE", payload: savedNote });
      showSnackbar("Note added successfully!");
      setShowAddNote(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add note";
      console.error("Failed to add note:", message);
      showSnackbar(message, "error");
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      dispatch({ type: "DELETE_NOTE", payload: { id } });
      showSnackbar("Note deleted successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete note";
      console.error("Failed to delete note:", message);
      showSnackbar(message, "error");
    }
  };

  const handleSortChange = (value: string) => {
    dispatch({ type: "SET_SORT", payload: value });
  };

  useEffect(() => {
    if (!location.state) return;
    const navState = location.state as NavState;
    if (navState.snackbarMessage) showSnackbar(navState.snackbarMessage);
    if (navState.showSaved) showSnackbar("Notecard saved successfully!");
    if (navState.showDeleted) showSnackbar("Note deleted successfully!");
    window.history.replaceState({}, document.title);
  }, [location.state, showSnackbar]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <main className={styles.main}>
      {viewMode === "basic" && (
        <>
          <div className={styles.addNoteBox}>
            <Paper className={styles.addNotePaper}>
              <div
                className={styles.addNoteToggle}
                onClick={() => setShowAddNote((prev) => !prev)}
              >
                <Typography className={styles.addNoteToggleLabel}>
                  Add Note Details
                </Typography>
                <IconButton size="small">
                  <ExpandMoreIcon
                    className={`${styles.expandIcon} ${showAddNote ? styles.open : ""}`}
                  />
                </IconButton>
              </div>
              <Collapse in={showAddNote}>
                <div className={styles.addNoteCollapse}>
                  <AddNoteForm onAddNote={handleAddNote} />
                </div>
              </Collapse>
            </Paper>
          </div>

          <div className={styles.titleBar}>
            <Typography className={styles.sectionTitle}>
              Checklist Chronicles: Conquering Tasks One Tick at a Time
            </Typography>
            <FormControl size="small" className={styles.sortControl}>
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
          </div>

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
              <div className={styles.titleBar}>
                <Typography className={styles.sectionTitle}>
                  Checklist Chronicles: Conquering Tasks One Tick at a Time
                </Typography>
                <FormControl size="small" className={styles.sortControl}>
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
              </div>

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
