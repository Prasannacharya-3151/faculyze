import { useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { toast } from "react-toastify";
import logo from "../../assets/Lorenta-1.png";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

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

  const handleLogout = () => {
    try {
      logout();
      toast.success("Signed out successfully");
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="w-full bg-background border-b border-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto object-contain lg:hidden cursor-pointer"
              onClick={() => navigate("/")}
            />

            <h1 className="hidden sm:block text-lg font-semibold text-foreground font-heading">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {getInitials(user?.username)}
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 bg-card border border-border rounded-lg shadow-lg mt-1 py-1"
                align="end"
                sideOffset={5}
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                      {getInitials(user?.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="py-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-primary/10 cursor-pointer w-full"
                  >
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </div>
    </nav>
  );
}
