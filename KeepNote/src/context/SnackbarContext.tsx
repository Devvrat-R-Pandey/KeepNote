import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import type {SnackbarCloseReason } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

/* Slide animation */
function SlideUpTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("success");

  /* function to trigger snackbar */
  const showSnackbar = useCallback((msg: string, sev: Severity = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  /* correct MUI onClose typing */
  const handleClose = (
    event: Event | React.SyntheticEvent,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={SlideUpTransition}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          variant="filled"
          icon={severity === "error" ? <ErrorIcon /> : <CheckCircleIcon />}
          onClose={handleClose}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

    </SnackbarContext.Provider>
  );
};

/* custom hook */
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  }

  return context;
};