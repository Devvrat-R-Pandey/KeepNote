import { createContext } from "react";
import { initialNotesState } from "../reducers/notesReducer";
import { initialAuthState } from "../reducers/authReducer";
import type { RootAction } from "../reducers/rootReducer";
import type React from "react";

interface AppState {
  notes: typeof initialNotesState;
  auth: typeof initialAuthState;
}

export const initialState: AppState = {
  notes: initialNotesState,
  auth: initialAuthState,
};

export type Action = RootAction;

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});