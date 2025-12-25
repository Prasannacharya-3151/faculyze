import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
// import { useEffect, useState } from "react";
// import { apiRequest } from "../../lib/api"; // 🔴 USE LATER

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();

  // 🔴 TEMP STATIC USER DATA
  // TODO: Replace with API response
  const user = {
    name: "Dr. Rajesh Kumar",
    role: "Physics Faculty",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  };

  // 🔴 API FETCH (ENABLE LATER)
  /*
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiRequest("/faculty/me", "GET")
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);
  */

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/upload":
        return "Upload Notes";
      case "/uploaded":
        return "Uploaded Notes";
      case "/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <nav
      className="
        w-full
        bg-background
        border-b border-border
        sticky top-0 z-40
      "
    >
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={onMenuClick}
              className="
                lg:hidden
                p-2 rounded-lg
                hover:bg-primary/10
                transition
              "
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            {/* PAGE TITLE */}
            <h1 className="hidden sm:block text-xl font-bold text-foreground">
              {getPageTitle()}
            </h1>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            {/* USER INFO (HIDE ON MOBILE) */}
             <div className=" leading-tight">
              <p className="text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.role}
              </p>
            </div>

            {/* AVATAR */}
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="
                  w-10 h-10 rounded-full
                  border border-border
                  object-cover
                "
              />

              {/* ONLINE STATUS */}
              <span
                className="
                  absolute bottom-0 right-0
                  w-3 h-3 rounded-full
                  bg-accent
                  border-2 border-background
                "
              />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
