import React from "react";

interface ErrorMessageProps {
  type?: "error" | "info";
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ type = "error", message }) => {
  return (
    <p
      role={type === "error" ? "alert" : "status"}
      style={{
        color: type === "error" ? "#ef4444" : "var(--text)",
        fontSize: "18px",
        textAlign: "center",
        margin: "8px 0"
      }}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;