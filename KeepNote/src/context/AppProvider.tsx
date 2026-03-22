import React, { useReducer } from "react";
import type { ReactNode } from "react";
import { AppContext } from "./AppContext";
import { rootReducer, initialRootState } from "../reducers/rootReducer";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialRootState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};