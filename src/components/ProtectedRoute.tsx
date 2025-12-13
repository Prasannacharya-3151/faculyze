import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { token, authChecked } = useAuth();

  // Wait until token validation finishes
  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  // No token after validation
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Auth OK
  return children;
}
