import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navabr";

export default function SidebarLayout() {
  return (
    <div className="flex h-screen w-full">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Faculty Panel</h1>

        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-white text-purple-700 font-semibold shadow-lg' 
                : 'hover:bg-purple-600 hover:bg-opacity-50 text-white'
              }`
            }
          >
            
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/upload" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-white text-purple-700 font-semibold shadow-lg' 
                : 'hover:bg-purple-600 hover:bg-opacity-50 text-white'
              }`
            }
          >
            
            <span>Upload Notes</span>
          </NavLink>
          
          <NavLink 
            to="/uploaded" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-white text-purple-700 font-semibold shadow-lg' 
                : 'hover:bg-purple-600 hover:bg-opacity-50 text-white'
              }`
            }
          >
          
            <span>Uploaded Notes</span>
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-white text-purple-700 font-semibold shadow-lg' 
                : 'hover:bg-purple-600 hover:bg-opacity-50 text-white'
              }`
            }
          >
        
            <span>Profile</span>
          </NavLink>
        </nav>
        
        {/* Logout Button at Bottom */}
        <div className="mt-auto pt-8 border-t border-purple-500 border-opacity-30">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 hover:bg-opacity-20 text-white w-full transition-all duration-200">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* RIGHT PAGE AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}