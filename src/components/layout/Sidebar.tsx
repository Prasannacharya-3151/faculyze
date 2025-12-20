// import { Outlet, NavLink } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "./Navabr";

// export default function SidebarLayout() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex h-screen w-full overflow-hidden">

//       {/* MOBILE OVERLAY */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//         />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`fixed lg:static z-50 h-full w-64 bg-primary text-background p-6 transform transition-transform duration-300
//         ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
//       >
//         <h1 className="text-xl font-bold mb-8">Faculty Panel</h1>

//         <nav className="flex flex-col gap-2">
//           {[
//             { to: "/", label: "Dashboard", end: true },
//             { to: "/upload", label: "Upload Notes" },
//             { to: "/uploaded", label: "Uploaded Notes" },
//             { to: "/profile", label: "Profile" },
//           ].map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.end}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `px-4 py-3 rounded-full transition-all duration-200
//                 ${
//                   isActive
//                     ? "bg-background text-primary font-semibold shadow-lg hover:text-primary"
//                     : "hover:bg-primary-foreground hover:bg-opacity-50"
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* LOGOUT */}
//         <div className="mt-80 pt-8 border-t border-background border-opacity-30">
//           <button
//             className="w-full px-4 py-3 rounded-full hover:bg-red-500 hover:bg-opacity-20 transition"
//             onClick={() => {
//               // 🔥 API LOGOUT (ADD LATER)
//               /*
//               await fetch("/api/logout", {
//                 method: "POST",
//                 headers: {
//                   Authorization: `Bearer TOKEN`,
//                 },
//               });
//               */
//               console.log("Logout clicked");
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* MAIN AREA */}
//       <div className="flex-1 flex flex-col">
//         <Navbar onMenuClick={() => setOpen(true)} />

//         <main className="flex-1 bg-background p-4 sm:p-6 overflow-auto">
//           {/* 🔥 FETCH DATA HERE LATER */}
//           {/*
//             useEffect(() => {
//               fetch("/api/dashboard", {
//                 headers: {
//                   Authorization: `Bearer TOKEN`,
//                 },
//               })
//               .then(res => res.json())
//               .then(data => setState(data))
//             }, []);
//           */}
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navabr";
import {
  IconLayoutDashboard,
  IconUpload,
  IconFileText,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";

export default function SidebarLayout() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Dashboard", icon: IconLayoutDashboard, end: true },
    { to: "/upload", label: "Upload Notes", icon: IconUpload },
    { to: "/uploaded", label: "Uploaded Notes", icon: IconFileText },
    { to: "/profile", label: "Profile", icon: IconUser },
  ];

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
        className={`fixed lg:static z-50 h-full w-64
        bg-primary text-primary-foreground
        px-6 py-8
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* TITLE */}
        <h1 className="text-lg font-semibold tracking-wide mb-10">
          Faculty Panel
        </h1>

        {/* NAV */}
        <nav className="flex flex-col gap-3">
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
                      ? "bg-background text-primary shadow-md"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                  }
                `
                }
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto pt-10">
          <button
            className="
              flex items-center gap-3
              w-full px-5 py-3 rounded-full text-sm font-medium
              text-white/80
              hover:bg-white/15 hover:text-white
              transition
            "
            onClick={() => {
              console.log("Logout clicked");
            }}
          >
            <IconLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 bg-background p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
