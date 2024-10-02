import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "admin") {
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};
