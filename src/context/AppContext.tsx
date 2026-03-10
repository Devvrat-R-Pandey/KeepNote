// src/context/AppContext.tsx

import React, { createContext, useReducer } from "react";
import type { ReactNode } from "react";

import { notesReducer, initialNotesState } from "../reducers/notesReducer";
import { authReducer, initialAuthState } from "../reducers/authReducer";

import type { NotesAction } from "../reducers/notesReducer";
import type { AuthAction } from "../reducers/authReducer";

interface AppState {
  notes: typeof initialNotesState;
  auth: typeof initialAuthState;
}

export const initialState: AppState = {
  notes: initialNotesState,
  auth: initialAuthState,
};

export type Action = NotesAction | AuthAction;

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

function rootReducer(state: AppState, action: Action): AppState {
  return {
    notes: notesReducer(state.notes, action as NotesAction),
    auth: authReducer(state.auth, action as AuthAction),
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );

};