import React from "react";
import { ErrorMessageContainer, ErrorMessageText } from "./ErrorMessage.styles";

interface ErrorMessageProps {
  type?: "error" | "info";
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ type = "error", message }) => {
  return (
    <ErrorMessageContainer
      type={type}
      role={type === "error" ? "alert" : "status"}
    >
      <ErrorMessageText>{message}</ErrorMessageText>
    </ErrorMessageContainer>
  );
};

export default ErrorMessage;