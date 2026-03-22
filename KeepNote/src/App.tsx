import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NoteManager from "./components/NoteManager/NoteManager";
import NoteDetail from "./pages/NoteDetail/NoteDetail";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import UserProfile from "./pages/UserProfile/UserProfile";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

import { AppContext } from "./context/AppContext";
import { AppProvider } from "./context/AppProvider";
import { SnackbarProvider } from "./context/SnackbarProvider";
import styles from "./App.module.css";

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useContext(AppContext);
  if (!state.auth.isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/* ---------------- App Content ---------------- */
const AppContent: React.FC = () => {
  const { state } = useContext(AppContext);
  const [viewMode, setViewMode] = useState<"basic" | "advanced">("basic");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = state.auth.isAuthenticated;

  const handleToggleView = () =>
    setViewMode((prev) => (prev === "basic" ? "advanced" : "basic"));

  const toggleButton = (
    <Button
      onClick={handleToggleView}
      variant="contained"
      startIcon={viewMode === "basic" ? <SearchIcon /> : <ArrowBackIcon />}
      className={styles.toggleBtn}
    >
      {viewMode === "basic" ? "Advanced Search" : "Basic Search"}
    </Button>
  );

  return (
    <BrowserRouter>
      <div className={styles.appShell}>
        <Header
          searchTerm={isLoggedIn ? searchTerm : ""}
          setSearchTerm={isLoggedIn ? setSearchTerm : () => {}}
          onSearch={isLoggedIn ? setSearchTerm : () => {}}
          viewMode={viewMode}
          toggleButton={isLoggedIn ? toggleButton : null}
          isLoggedIn={isLoggedIn}
        />

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <NoteManager viewMode={viewMode} searchTerm={searchTerm} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

/* ---------------- App Wrapper ---------------- */
const App: React.FC = () => (
  <SnackbarProvider>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </SnackbarProvider>
);

export default App;