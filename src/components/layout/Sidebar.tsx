import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navabr";

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);

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
        className={`fixed lg:static z-50 h-full w-64 bg-gradient-to-b from-purple-700 to-purple-900
        text-white p-6 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h1 className="text-xl font-bold mb-8">Faculty Panel</h1>

        <nav className="flex flex-col gap-2">
          {[
            { to: "/", label: "Dashboard", end: true },
            { to: "/upload", label: "Upload Notes" },
            { to: "/uploaded", label: "Uploaded Notes" },
            { to: "/profile", label: "Profile" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-purple-700 font-semibold shadow-lg"
                    : "hover:bg-purple-600 hover:bg-opacity-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto pt-8 border-t border-purple-500 border-opacity-30">
          <button
            className="w-full px-4 py-3 rounded-xl hover:bg-red-500 hover:bg-opacity-20 transition"
            onClick={() => {
              // 🔥 API LOGOUT (ADD LATER)
              /*
              await fetch("/api/logout", {
                method: "POST",
                headers: {
                  Authorization: `Bearer TOKEN`,
                },
              });
              */
              console.log("Logout clicked");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setOpen(true)} />

        <main className="flex-1 bg-gray-50 p-4 sm:p-6 overflow-auto">
          {/* 🔥 FETCH DATA HERE LATER */}
          {/*
            useEffect(() => {
              fetch("/api/dashboard", {
                headers: {
                  Authorization: `Bearer TOKEN`,
                },
              })
              .then(res => res.json())
              .then(data => setState(data))
            }, []);
          */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
