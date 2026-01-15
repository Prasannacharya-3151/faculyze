import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
children: React.ReactNode;

}) {
  const { authChecked, token, } = useAuth(); //here i have romvued token after i should add in here {token, authChecked}

  // Wait until token validation finishes
  if (!authChecked) {
    return (
       <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  // No token after validation
  if (!token) {
    return <Navigate to="/register" replace />;
  }

  // Auth OK
  return children;
}
