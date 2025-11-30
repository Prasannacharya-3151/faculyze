import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navabr";

export default function SidebarLayout() {
  return (
    <div className="flex h-screen w-full">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-rose-300 text-white p-6">
        <h1 className="text-xl font-bold mb-6">Faculty Panel</h1>

        <nav className="flex flex-col gap-3">
          <NavLink to="/" className="hover:text-accent">Dashboard</NavLink>
          <NavLink to="/upload" className="hover:text-accent">Upload Notes</NavLink>
          <NavLink to="/uploaded" className="hover:text-accent">Uploaded Notes</NavLink>
          <NavLink to="/profile" className="hover:text-accent">Profile</NavLink>
        </nav>
      </aside>

      {/* RIGHT PAGE AREA */}
      <main className="flex-1 bg-background p-6 overflow-auto">
         <Navbar />
        <Outlet />
      </main>

    </div>
  );
}


