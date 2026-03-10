import styled from "styled-components";

export const ErrorMessageContainer = styled.div<{ type: "error" | "info" }>`
  margin: 12px 0;
  padding: ${({ type }) => (type === "error" ? "12px" : "8px")};
  border-radius: 6px;
  text-align: center;
  font-weight: ${({ type }) => (type === "error" ? "600" : "400")};
  color: ${({ type }) => (type === "error" ? "#ef4444" : "#fff")};
  background: ${({ type }) =>
    type === "error" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.1)"};

  &:focus {
    outline: 2px solid ${({ type }) => (type === "error" ? "#ef4444" : "#fff")};
  }
`;

export const ErrorMessageText = styled.p`
  margin: 0;
  font-size: 14px;
`;