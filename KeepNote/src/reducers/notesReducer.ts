import type { Note } from "../types/Note";

/* -------------------- State Shape -------------------- */
export interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  advancedFilteredNotes: Note[];
  sortBy: string;
  searchCount: number;
  searchesPerformed: number;
  searchUrl: string;
  errorMessage?: string;
  hasSearched?: boolean;
  // FIX: track active basic search term so ADD/DELETE can preserve the filter
  activeSearchTerm: string;
}

/* -------------------- Actions -------------------- */
export type NotesAction =
  | { type: "SET_NOTES"; payload: Note[] }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: { id: number } }
  | { type: "FILTER_BASIC"; payload: string }
  | {
      type: "FILTER_ADVANCED";
      payload: {
        category?: string;
        priority?: string;
        __clear?: boolean;
        __empty?: boolean;
      };
    }
  | { type: "SET_SORT"; payload: string };

/* -------------------- Initial State -------------------- */
export const initialNotesState: NotesState = {
  notes: [],
  filteredNotes: [],
  advancedFilteredNotes: [],
  sortBy: "",
  searchCount: 0,
  searchesPerformed: 0,
  searchUrl: "",
  errorMessage: "",
  hasSearched: false,
  activeSearchTerm: "",
};

/* -------------------- Helper -------------------- */
function applyBasicFilter(notes: Note[], term: string): Note[] {
  if (!term) return notes;
  return notes.filter((note) =>
    note.title.toLowerCase().includes(term.toLowerCase())
  );
}

/* -------------------- Reducer -------------------- */
export function notesReducer(
  state: NotesState,
  action: NotesAction
): NotesState {
  switch (action.type) {
    case "SET_NOTES":
      return {
        ...state,
        notes: action.payload,
        filteredNotes: applyBasicFilter(action.payload, state.activeSearchTerm),
      };

    case "ADD_NOTE": {
      const addedNotes = [...state.notes, action.payload];
      return {
        ...state,
        notes: addedNotes,
        // FIX: preserve active search filter after adding a note
        filteredNotes: applyBasicFilter(addedNotes, state.activeSearchTerm),
      };
    }

    case "DELETE_NOTE": {
      const remainingNotes = state.notes.filter(
        (n) => n.id !== action.payload.id
      );
      return {
        ...state,
        notes: remainingNotes,
        // FIX: preserve active search filter after deleting a note
        filteredNotes: applyBasicFilter(remainingNotes, state.activeSearchTerm),
        advancedFilteredNotes: state.advancedFilteredNotes.filter(
          (n) => n.id !== action.payload.id
        ),
      };
    }

    case "FILTER_BASIC":
      return {
        ...state,
        activeSearchTerm: action.payload,
        filteredNotes: applyBasicFilter(state.notes, action.payload),
      };

    case "FILTER_ADVANCED": {
      const { category, priority, __clear, __empty } = action.payload;

      if (__clear) {
        return {
          ...state,
          advancedFilteredNotes: [],
          searchCount: 0,
          searchesPerformed: 0,
          searchUrl: "",
          errorMessage: "",
          hasSearched: false,
        };
      }

      if (__empty) {
        return {
          ...state,
          advancedFilteredNotes: [],
          searchCount: 0,
          searchesPerformed: state.searchesPerformed + 1,
          searchUrl: "",
          errorMessage: "Please enter at least one filter to search.",
          hasSearched: true,
        };
      }

      const advFiltered = state.notes.filter((note) => {
        return (
          (!category ||
            note.category?.toLowerCase() === category.toLowerCase()) &&
          (!priority || note.priority?.toLowerCase() === priority.toLowerCase())
        );
      });

      return {
        ...state,
        advancedFilteredNotes: advFiltered,
        searchCount: advFiltered.length,
        searchesPerformed: state.searchesPerformed + 1,
        searchUrl: "",
        errorMessage:
          advFiltered.length === 0
            ? "No notes matched your search criteria. Try adjusting filters or check spelling."
            : "",
        hasSearched: true,
      };
    }

    case "SET_SORT": {
      const sortBy = action.payload;
      const sortedNotes = [...state.filteredNotes].sort((a, b) => {
        if (sortBy === "status") return a.status.localeCompare(b.status);
        if (sortBy === "priority")
          return (a.priority || "").localeCompare(b.priority || "");
        return 0;
      });
      return { ...state, sortBy, filteredNotes: sortedNotes };
    }

    default:
      return state;
  }
}
