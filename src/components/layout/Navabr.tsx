import { useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import logo from "../../assets/Lorenta-1.png"
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick?: () => void;
}

interface UserData {
  username: string;
  email?: string;
  role?: string;
  profile_completed?: boolean;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (authUser) {
          setUser({
            username: authUser.username || "User",
            email: authUser.email || "",
            profile_completed: authUser.profile_completed
          });
          setLoading(false);
          return;
        }
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser({
              username: parsedUser.username || "User",
              email: parsedUser.email || "",
              role: parsedUser.role || "Faculty",
              profile_completed: parsedUser.profile_completed
            });
          } catch (error) {
            console.error("Error parsing saved user:", error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser({
          username: "User",
          email: "user@example.com",
          role: "Faculty",
          profile_completed: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const getInitials = (name: string): string => {
    if (!name) return "U";
    const trimmed = name.trim();
    if (trimmed.length === 0) return "U";
    return trimmed.charAt(0).toUpperCase();
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
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <nav className="w-full bg-background border-b border-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
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
              onClick={() => navigate("/dashboard")}
            />

            <h1 className="hidden sm:block text-lg font-semibold text-foreground font-heading">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            ) : (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="User menu"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                        {getInitials(user?.username || "U")}
                      </div>
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-56 bg-card border border-border rounded-lg shadow-lg mt-1 py-1"
                  align="end"
                  sideOffset={5}
                >
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                        {getInitials(user?.username || "U")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <DropdownMenuItem 
                      onClick={() => {
                        if (logout) logout();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer w-full"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}