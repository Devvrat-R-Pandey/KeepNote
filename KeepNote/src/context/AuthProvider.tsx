import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";

function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("loggedInUser");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredAuthUser);

  const login = (userData: AuthUser) => {
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};