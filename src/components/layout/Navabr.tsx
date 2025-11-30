
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  // Get current page title based on route
  const getPageTitle = () => {
    switch(location.pathname) {
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
    <nav className="w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Page Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Side - Profile Info */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800 dark:text-white">
                Dr. Rajesh Kumar
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Physics Faculty
              </p>
            </div>
            
            {/* Profile Picture */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
              {/* Online Status Indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}