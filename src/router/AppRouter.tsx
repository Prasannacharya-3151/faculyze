import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "../components/layout/Sidebar";

import Dashboard from "../pages/dashboard/Dashboard";
import UploadNotes from "../pages/upload/UploadNotes";
import UploadedNotes from "../pages/uploaded/UploadedNotes";
import Profile from "../pages/profile/Profile";

import LoginFormDemo from "../pages/auth/login";
import RegisterFormDemo from "../pages/auth/register";
import ProfileSetup from "../pages/auth/profilesetup";

import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* public router */}
          <Route path="/login" element={<LoginFormDemo />} />
          <Route path="/register" element={<RegisterFormDemo />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          {/* protected router  */}
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

         
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
