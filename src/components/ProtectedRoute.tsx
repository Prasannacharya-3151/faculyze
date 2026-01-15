import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
children: React.ReactNode;
}) {
  const { authChecked, token } = useAuth(); //here i have romvued token after i should add in here {token, authChecked}

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
