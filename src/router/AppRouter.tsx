import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import  SidebarLayout from "../components/layout/Sidebar";
// import Navbar from "../components/layout/Navabr";
import SidebarLayout from "../components/layout/Sidebar";

import Dashboard from "../pages/dashboard/Dashboard";
import UploadNotes from "../pages/upload/UploadNotes";
import UploadedNotes from "../pages/uploaded/UploadedNotes";
import Profile from "../pages/profile/Profile";

import LoginFormDemo from "../pages/auth/login";
import RegisterFormDemo from "../pages/auth/register";
import ProfileSetup from "../pages/auth/profilesetup";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginFormDemo />} />
        <Route path="/register" element={<RegisterFormDemo />} />

        {/* Profile Setup Before Dashboard */}
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* Protected Layout (Sidebar always visible) */}
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadNotes />} />
          <Route path="uploaded" element={<UploadedNotes />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
