import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NoteManager from "./components/NoteManager/NoteManager";
import NoteDetail from "./pages/NoteDetail";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import UserProfile from "./pages/UserProfile";
import PageNotFound from "./pages/PageNotFound";

import { AppProvider, AppContext } from "./context/AppContext";
import { SnackbarProvider } from "./context/SnackbarContext";

/* ---------------- Protected Route ---------------- */

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useContext(AppContext);

  if (!state.auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* ---------------- App Content ---------------- */

const AppContent: React.FC = () => {
  const { state } = useContext(AppContext);

  const [viewMode, setViewMode] = useState<"basic" | "advanced">("basic");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = state.auth.isAuthenticated;

  const handleToggleView = () => {
    setViewMode((prev) => (prev === "basic" ? "advanced" : "basic"));
  };

  const toggleButton = (
    <Button
      onClick={handleToggleView}
      variant="contained"
      startIcon={viewMode === "basic" ? <SearchIcon /> : <ArrowBackIcon />}
      sx={{
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: 13,
        height: 38,
        px: 2,
        borderRadius: "6px",
        backgroundColor: "var(--yellow)",
        color: "#fff",
        "&:hover": { backgroundColor: "var(--yellow-dark)" },
      }}
    >
      {viewMode === "basic" ? "Advanced Search" : "Basic Search"}
    </Button>
  );

  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--app-bg)",
        }}
      >
        {/* Header */}

        <Header
          searchTerm={isLoggedIn ? searchTerm : ""}
          setSearchTerm={isLoggedIn ? setSearchTerm : () => {}}
          onSearch={isLoggedIn ? setSearchTerm : () => {}}
          viewMode={viewMode}
          toggleButton={isLoggedIn ? toggleButton : null}
          isLoggedIn={isLoggedIn}
        />

        {/* Main Content */}

        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
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
        </Box>

        <Footer />
      </Box>
    </BrowserRouter>
  );
};

/* ---------------- App Wrapper ---------------- */

const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SnackbarProvider>
  );
};

export default App;