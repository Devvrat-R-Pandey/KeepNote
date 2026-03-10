export const validationRules = {
  firstName: {
    required: "First name is required",
    minLength: { value: 2, message: "Minimum 2 characters required" },
  },

  lastName: {
    required: "Last name is required",
    minLength: { value: 2, message: "Minimum 2 characters required" },
  },

  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  },

  password: {
    required: "Password is required",
    minLength: { value: 6, message: "Minimum 6 characters required" },
  },

  confirmPassword: {
    required: "Confirm password is required",
  },

  gender: {
    required: "Gender is required",
  },

  age: {
    required: "Age is required",
    min: { value: 18, message: "Age must be at least 18" },
  },

  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: "Enter valid 10-digit phone number",
    },
  },

  street: {
    required: "Street is required",
  },

  city: {
    required: "City is required",
  },

  state: {
    required: "State is required",
  },

  zip: {
    required: "Zip code is required",
    pattern: {
      value: /^\d{5,6}$/,
      message: "Enter valid zip code",
    },
  },
};
