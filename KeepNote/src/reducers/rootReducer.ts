// src/reducers/rootReducer.ts
import { authReducer, initialAuthState } from "./authReducer";
import { notesReducer, initialNotesState } from "./notesReducer";
import type { NotesAction, NotesState } from "./notesReducer";
import type { AuthAction, AuthState } from "./authReducer";

export interface RootState {
  auth: AuthState;
  notes: NotesState;
}

// Union of all possible actions
export type RootAction = AuthAction | NotesAction;

export const initialRootState: RootState = {
  auth: initialAuthState,
  notes: initialNotesState,
};

export function rootReducer(state: RootState, action: RootAction): RootState {
  // Narrow by action type prefix to avoid passing irrelevant actions
  if (isAuthAction(action)) {
    return {
      ...state,
      auth: authReducer(state.auth, action),
    };
  }

  if (isNotesAction(action)) {
    return {
      ...state,
      notes: notesReducer(state.notes, action),
    };
  }

  // If action is not recognized, return current state
  return state;
}

/* -------------------- Type Guards -------------------- */
function isAuthAction(action: RootAction): action is AuthAction {
  return (
    action.type === "LOGIN" ||
    action.type === "LOGOUT"
  );
}

function isNotesAction(action: RootAction): action is NotesAction {
  return [
    "SET_NOTES",
    "ADD_NOTE",
    "DELETE_NOTE",
    "FILTER_BASIC",
    "FILTER_ADVANCED",
    "SET_SORT",
  ].includes(action.type);
}