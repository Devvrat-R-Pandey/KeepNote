import React, { useState, useContext } from "react";
import { Button, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import RegistrationForm from "./RegistrationForm";
import { addUser } from "../../services/userService";
import type { User } from "../../services/userService";
import { AppContext } from "../../context/AppContext";
import { useSnackbar } from "../../hooks/useSnackbar";
import styles from "../../pages/Registration/RegistrationPage.module.css";

const TOTAL_STEPS = 3;

const RegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
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

  const onSubmit = async (data: FieldValues) => {
    try {
      const newUser = await addUser(data as Omit<User, "id">);
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));
      dispatch({
        type: "LOGIN",
        payload: { userId: newUser.id, user: newUser },
      });
      showSnackbar("You have registered successfully!", "success");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : "Registration failed.",
        "error",
      );
    }
  };

  return (
    <div className={styles.page}>
      <Paper elevation={3} className={styles.card}>
        <p className={styles.pageTitle}>Registration</p>

        <RegistrationForm
          step={step}
          register={register}
          errors={errors}
          watch={watch}
        />

        <div className={styles.btnRow}>
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
        </div>
      </Paper>
    </div>
  );
};

export default RegistrationPage;
