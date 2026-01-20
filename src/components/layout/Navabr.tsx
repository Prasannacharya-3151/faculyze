// import { useLocation } from "react-router-dom";
// import { Menu } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { apiRequest } from "../../lib/api"; // 🔴 USE LATER

// interface NavbarProps {
//   onMenuClick?: () => void;
// }

// export default function Navbar({ onMenuClick }: NavbarProps) {
//   const location = useLocation();

//   // 🔴 TEMP STATIC USER DATA
//   // TODO: Replace with API response
//   const user = {
//     name: "Dr. Rajesh Kumar",
//     role: "Physics Faculty",
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
//   };

//   // 🔴 API FETCH (ENABLE LATER)
//   /*
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     apiRequest("/faculty/me", "GET")
//       .then(res => setUser(res.data))
//       .catch(err => console.error(err));
//   }, []);
//   */

//   const getPageTitle = () => {
//     switch (location.pathname) {
//       case "/":
//         return "Dashboard";
//       case "/upload":
//         return "Upload Notes";
//       case "/uploaded":
//         return "Uploaded Notes";
//       case "/profile":
//         return "Profile";
//       default:
//         return "Dashboard";
//     }
//   };

//   return (
//     <nav
//       className="
//         w-full
//         bg-background
//         border-b border-border
//         sticky top-0 z-40
//       "
//     >
//       <div className="px-4 sm:px-6 py-4">
//         <div className="flex items-center justify-between">

//           {/* LEFT SECTION */}
//           <div className="flex items-center gap-3">
//             {/* MOBILE MENU BUTTON */}
//             <button
//               onClick={onMenuClick}
//               className="
//                 lg:hidden
//                 p-2 rounded-lg
//                 hover:bg-primary/10
//                 transition
//               "
//             >
//               <Menu className="w-5 h-5 text-foreground" />
//             </button>

//             {/* PAGE TITLE */}
//             <h1 className="hidden sm:block text-xl font-bold text-foreground">
//               {getPageTitle()}
//             </h1>
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="flex items-center gap-4">
//             {/* USER INFO (HIDE ON MOBILE) */}
//              <div className=" leading-tight">
//               <p className="text-sm font-semibold text-foreground">
//                 {user.name}
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 {user.role}
//               </p>
//             </div>

//             {/* AVATAR */}
//             <div className="relative">
//               <img
//                 src={user.avatar}
//                 alt="Profile"
//                 className="
//                   w-10 h-10 rounded-full
//                   border border-border
//                   object-cover
//                 "
//               />

//               {/* ONLINE STATUS */}
//               <span
//                 className="
//                   absolute bottom-0 right-0
//                   w-3 h-3 rounded-full
//                   bg-accent
//                   border-2 border-background
//                 "
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// }
import { useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { Link } from "react-router-dom";

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
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Use auth context data if available
        if (authUser) {
          setUser({
            username: authUser.username || "User",
            email: authUser.email || "",
            // role: authUser.role || "Faculty",
            profile_completed: authUser.profile_completed
          });
          setLoading(false);
          return;
        }

        // Fallback to localStorage
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

  // Get first letter of username
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
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* PAGE TITLE */}
            <h1 className="hidden sm:block text-lg font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>

          {/* RIGHT SECTION - USER PROFILE */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            ) : (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="User menu"
                  >
                    {/* AVATAR CIRCLE - Like Google's */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(user?.username || "U")}
                      </div>
                    </div>
                    
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </DropdownMenuTrigger>

                {/* DROPDOWN CONTENT - Like Google's Profile Dropdown */}
                <DropdownMenuContent 
                  className="w-64 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 py-2"
                  align="end"
                  sideOffset={5}
                >
                  {/* PROFILE SECTION */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      {/* AVATAR */}
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-base">
                        {getInitials(user?.username || "U")}
                      </div>
                      
                      {/* USER INFO */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WELCOME MESSAGE */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      Hi, <span className="font-medium text-gray-900">{user?.username?.split(' ')[0] || "User"}</span>!
                    </p>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="py-1">
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer w-full"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span>Your Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer w-full"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link 
                        to="/help" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer w-full"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span>Help & Support</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* LOGOUT */}
                  <DropdownMenuItem 
                    onClick={() => {
                      if (logout) logout();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}