import React from "react";
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { validationRules } from "../../utils/ValidationRules";

interface Props {
  step: number;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  watch: UseFormWatch<any>;
}

const RegistrationForm: React.FC<Props> = ({
  step,
  register,
  errors,
  watch,
}) => {
  const password = watch("password");

  if (step === 3) {
    const values = watch();
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Review Your Details
        </Typography>

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
          <Typography key={label}>
            <strong>{label}:</strong> {value}
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
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
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message as string}
          />
        </>
      )}

      {step === 2 && (
        <>
<RadioGroup row defaultValue="">
  {["Male", "Female", "Non-Binary"].map((option) => (
    <FormControlLabel
      key={option}
      value={option}
      control={<Radio {...register("gender", validationRules.gender)} />}
      label={option}
    />
  ))}
</RadioGroup>
          <Typography color="error">{errors.gender?.message as string}</Typography>

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
    </Box>
  );
};

export default RegistrationForm;
