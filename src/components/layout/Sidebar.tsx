import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navabr";
import {
  IconLayoutDashboard,
  IconUpload,
  IconFileText,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";
import { toast } from "react-toastify";
import logo from "../../assets/Lorenta-1.png"

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { to: "/", label: "Dashboard", icon: IconLayoutDashboard, end: true },
    { to: "/upload", label: "Upload Notes", icon: IconUpload },
    { to: "/uploaded", label: "Uploaded Notes", icon: IconFileText },
    { to: "/profile", label: "Profile", icon: IconUser },
  ];

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", "POST");
    } catch (err: any) {
      console.warn("Logout API not found, continuing logout");
    } finally {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-50 h-full w-64
          bg-secondary text-primary-foreground
          px-6 py-8
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* BRAND - CENTERED */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 object-contain cursor-pointer"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>

        {/* NAV - ROUNDED FULL BUTTONS */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-5 py-3 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-background text-secondary shadow-md"
                      : "text-primary-foreground/80 hover:bg-white/15 hover:text-primary-foreground"
                  }
                `
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT - ROUNDED FULL BUTTON */}
        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3
              w-full px-5 py-3 rounded-full text-sm font-medium
              text-primary-foreground/80
              hover:bg-white/15 hover:text-primary-foreground
              transition-all duration-200
            "
          >
            <IconLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 bg-background p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}