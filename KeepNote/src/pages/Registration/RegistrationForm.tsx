import React from "react";
import { TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import type { UseFormRegister, FieldErrors, UseFormWatch, FieldValues } from "react-hook-form";
import { validationRules } from "../../utils/ValidationRules";
import styles from "../../pages/Registration/RegistrationPage.module.css";

interface Props {
  step: number;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  watch: UseFormWatch<FieldValues>;
}

const RegistrationForm: React.FC<Props> = ({ step, register, errors, watch }) => {
  const password = watch("password");

  if (step === 3) {
    const values = watch();
    return (
      <div className={styles.reviewBox}>
        <p className={styles.reviewTitle}>Review Your Details</p>
        {[
          ["First Name", values.firstName],
          ["Last Name", values.lastName],
          ["Email", values.email],
          ["Gender", values.gender],
          ["Age", values.age],
          ["Phone", values.phone],
          ["Street", values.street],
          ["City", values.city],
          ["State", values.state],
          ["Zip", values.zip],
        ].map(([label, value]) => (
          <p key={label} className={styles.reviewRow}>
            <strong>{label}:</strong> {value}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.fieldGroup}>
      {step === 1 && (
        <>
          <TextField
            label="First Name"
            {...register("firstName", validationRules.firstName)}
            error={!!errors.firstName}
            helperText={errors.firstName?.message as string}
          />
          <TextField
            label="Last Name"
            {...register("lastName", validationRules.lastName)}
            error={!!errors.lastName}
            helperText={errors.lastName?.message as string}
          />
          <TextField
            label="Email"
            {...register("email", validationRules.email)}
            error={!!errors.email}
            helperText={errors.email?.message as string}
          />
          <TextField
            type="password"
            label="Password"
            {...register("password", validationRules.password)}
            error={!!errors.password}
            helperText={errors.password?.message as string}
          />
          <TextField
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              ...validationRules.confirmPassword,
              validate: (value) => value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message as string}
          />
        </>
      )}

      {step === 2 && (
        <>
          <RadioGroup row defaultValue="" className={styles.radioGroup}>
            {["Male", "Female", "Non-Binary"].map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio {...register("gender", validationRules.gender)} />}
                label={option}
              />
            ))}
          </RadioGroup>
          <p className={styles.genderError}>{errors.gender?.message as string}</p>

          <TextField
            label="Age"
            {...register("age", validationRules.age)}
            error={!!errors.age}
            helperText={errors.age?.message as string}
          />
          <TextField
            label="Phone Number"
            {...register("phone", validationRules.phone)}
            error={!!errors.phone}
            helperText={errors.phone?.message as string}
          />
          <TextField
            label="Street"
            {...register("street", validationRules.street)}
            error={!!errors.street}
            helperText={errors.street?.message as string}
          />
          <TextField
            label="City"
            {...register("city", validationRules.city)}
            error={!!errors.city}
            helperText={errors.city?.message as string}
          />
          <TextField
            label="State"
            {...register("state", validationRules.state)}
            error={!!errors.state}
            helperText={errors.state?.message as string}
          />
          <TextField
            label="Zip Code"
            {...register("zip", validationRules.zip)}
            error={!!errors.zip}
            helperText={errors.zip?.message as string}
          />
        </>
      )}
    </div>
  );
};

export default RegistrationForm;