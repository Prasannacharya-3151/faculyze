import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();

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
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="font-semibold text-gray-800">
                Dr. Rajesh Kumar
              </p>
              <p className="text-sm text-gray-500">
                Physics Faculty
              </p>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
