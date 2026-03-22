import { useContext } from "react";
import { Navigate } from "react-router-dom";
// FIX: was importing from AuthContext (unused context), should use AppContext
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useContext(AppContext);

  if (!state.auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
