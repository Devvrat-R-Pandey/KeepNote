import React, { useState, useContext } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import RegistrationForm from "../components/RegistrationForm/RegistrationForm";
import { addUser } from "../services/userService";
import { AppContext } from "../context/AppContext";
import { useSnackbar } from "../context/SnackbarContext";

const TOTAL_STEPS = 3;

const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  /* global snackbar */
  const { showSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const nextStep = async () => {
    const fields =
      step === 1
        ? ["firstName", "lastName", "email", "password", "confirmPassword"]
        : step === 2
        ? ["gender", "age", "phone", "street", "city", "state", "zip"]
        : [];

    if (await trigger(fields)) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: any) => {
    try {
      const newUser = await addUser(data);

      /* save user locally */
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      /* update global auth state */
      dispatch({
        type: "LOGIN",
        payload: { userId: newUser.id, user: newUser },
      });

      showSnackbar("You have registered successfully!", "success");

      setTimeout(() => navigate("/home"), 1500);

    } catch (err: any) {
      showSnackbar(err.message || "Registration failed.", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--app-bg)",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          py: 2,
          px: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          align="center"
          mb={1}
          color="text.secondary"
        >
          Registration
        </Typography>

        <RegistrationForm
          step={step}
          register={register}
          errors={errors}
          watch={watch}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          {step > 1 && (
            <Button size="small" variant="outlined" onClick={prevStep}>
              Back
            </Button>
          )}

          {step < TOTAL_STEPS ? (
            <Button size="small" variant="contained" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RegistrationPage;