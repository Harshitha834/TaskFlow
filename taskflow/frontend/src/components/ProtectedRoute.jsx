import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("taskflow_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
