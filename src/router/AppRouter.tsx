import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "../components/layout/Sidebar";

import Dashboard from "../pages/dashboard/Dashboard";
import UploadNotes from "../pages/upload/UploadNotes";
import UploadedNotes from "../pages/uploaded/UploadedNotes";
import Profile from "../pages/profile/Profile";
import LoginFormDemo from "../pages/auth/login";
import ForgotPasswordPage from "../components/forgotPassword/page";

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginFormDemo />
              </PublicRoute>
            }
          />

           <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          {/* ================= PRIVATE ROUTES ================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadNotes />} />
            <Route path="uploaded" element={<UploadedNotes />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
