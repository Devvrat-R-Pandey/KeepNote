import React, { useEffect, useState } from "react";
import SearchNote from "./SearchNote/SearchNote";
import AdvancedNoteSearch from "./AdvancedNoteSearch/AdvancedNoteSearch";
import NoteList from "./NoteList/NoteList";
import { fetchNotes } from "../services/noteService";
import { filterNotes } from "../utils/FilterNotes";
import type { Note } from "../types/Note";
import ErrorMessage from "./ErrorMessage/ErrorMessage";

interface Props {
  viewMode: "basic" | "advanced";
  setViewMode: React.Dispatch<React.SetStateAction<"basic" | "advanced">>;
}

const NoteContainer: React.FC<Props> = ({ viewMode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filtered, setFiltered] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchesPerformed, setSearchesPerformed] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const [lastCriteria, setLastCriteria] = useState<{ category: string; priority: string }>({
    category: "",
    priority: "",
  });

  /* Load notes when component loads */
  useEffect(() => {
    setLoading(true);

    fetchNotes()
      .then((data) => {
        setNotes(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "⚠️ Unable to load notes. Please start JSON Server or try again later."
        );
        setLoading(false);
      });
  }, []);

  /* Basic search - always increments */
  const handleSearch = (query: string) => {
    const result = filterNotes(notes, query);
    setFiltered(result);
    setSearchesPerformed((prev) => prev + 1);
    setHasSearched(true);
  };

  /* Advanced filter - only increments if criteria changed */
  const handleAdvancedFilter = (criteria: {
    category?: string;
    priority?: string;
    __clear?: boolean;
    __empty?: boolean;
  }) => {
    if (criteria.__clear) {
      setFiltered(notes);
      setHasSearched(false);
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

    if (criteria.__empty) {
      setFiltered([]);
      setHasSearched(true);
      if (hasCriteriaChanged) {
        setSearchesPerformed((prev) => prev + 1);
        setLastCriteria(newCriteria);
      }
      return;
    }

    let result = notes;

    if (criteria.category) {
      result = result.filter(
        (note) => note.category.toLowerCase() === newCriteria.category
      );
    }

    if (criteria.priority) {
      result = result.filter(
        (note) => note.priority?.toLowerCase() === newCriteria.priority
      );
    }

    setFiltered(result);
    setHasSearched(true);

    if (hasCriteriaChanged) {
      setSearchesPerformed((prev) => prev + 1);
      setLastCriteria(newCriteria);
    }
  };

  /* Loading state */
  if (loading) {
    return <ErrorMessage type="info" message="Loading notes..." />;
  }

  /* Error state */
  if (error) {
    return <ErrorMessage type="error" message={error} />;
  }

  return (
    <div>
      {viewMode === "basic" ? (
        <SearchNote onSearch={handleSearch} />
      ) : (
        <AdvancedNoteSearch
          notes={notes}
          onFilter={handleAdvancedFilter}
          searchesPerformed={searchesPerformed}
          searchUrl=""
        />
      )}

      {hasSearched ? (
        filtered.length > 0 ? (
          <NoteList notes={filtered} />
        ) : (
          <ErrorMessage
            type="info"
            message="No notes found. Try a different search."
          />
        )
      ) : null}
    </div>
  );
};

export default NoteContainer;