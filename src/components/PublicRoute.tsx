import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authChecked, token } = useAuth();

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If already logged in → redirect to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
