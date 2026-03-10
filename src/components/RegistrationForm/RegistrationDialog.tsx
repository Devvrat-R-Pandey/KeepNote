import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import RegistrationForm from "./RegistrationForm";
import { addUser } from "../../services/userService"; // ✅ new service

interface Props {
  open: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 3;

const RegistrationDialog: React.FC<Props> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const nextStep = async () => {
    // validate step-specific fields
    const fieldsToValidate =
      step === 1
        ? ["firstName", "lastName", "email", "password", "confirmPassword"]
        : step === 2
        ? ["gender", "age", "phone", "street", "city", "state", "zip"]
        : [];
    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

const onSubmit = async (data: any) => {
  try {
    console.log("Submitting user:", data); // ✅ debug payload
    await addUser(data);
    setSnackbar({ open: true, message: "Registration successful!", severity: "success" });
    setTimeout(() => {
      onClose();
      setStep(1);
    }, 2000);
  } catch (err: any) {
    console.error("Registration failed:", err); // ✅ log actual error
    setSnackbar({ open: true, message: err.message || "Failed to register user.", severity: "error" });
  }
};

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle align="center">Registration Process</DialogTitle>

        <DialogContent>
          <RegistrationForm step={step} register={register} errors={errors} watch={watch} />
        </DialogContent>

        <DialogActions>
          {step > 1 && (
            <Button variant="contained" onClick={prevStep}>
              BACK
            </Button>
          )}

          {step < TOTAL_STEPS ? (
            <Button variant="contained" onClick={nextStep}>
              NEXT →
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit(onSubmit)}>
              SUBMIT
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegistrationDialog;