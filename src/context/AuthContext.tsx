// import { createContext, useContext, useEffect, useState } from "react";
// import { apiRequest } from "../lib/api";

// interface UserData {
//   id?: string;
//   email?: string;
//   username?: string;
//   profile_completed?: boolean;
// }

// interface AuthContextType {
//   user: UserData | null;
//   token: string | null;
//   authChecked: boolean;
//   login: (user: UserData, token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem("token")
//   );
//   const [authChecked, setAuthChecked] = useState(false);

//   // 🔥 VALIDATE TOKEN ON APP LOAD
//   useEffect(() => {
//     const validate = async () => {
//       if (!token) {
//         setAuthChecked(true);
//         return;
//       }

//       try {
//         const res = await apiRequest("/faculty/me", "GET", null, token);
//         setUser((prev) => ({
//            ...prev,
//            ...res.user,
//       }));
//       } catch  {
//         logout();
//       } finally {
//         setAuthChecked(true);
//       }
//     };

//     validate();
//   }, [token]);

//   const login = (userData: UserData, jwtToken: string) => {
//     setUser(userData);
//     setToken(jwtToken);
//     localStorage.setItem("token", jwtToken);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, authChecked, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };


import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

interface User {
  username?: string;
  email?: string;
  profile_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  authChecked: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [authChecked, setAuthChecked] = useState(false);

  /* ---------- VALIDATE USER ---------- */
  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const res = await apiRequest("/faculty/me", "GET", null, token);

        setUser(prev => {
          const merged = { ...prev, ...res.user };
          localStorage.setItem("userData", JSON.stringify(merged));
          return merged;
        });
      } catch {
        logout();
      } finally {
        setAuthChecked(true);
      }
    };

    validate();
  }, [token]);

  /* ---------- LOGIN ---------- */
  const login = (userData: User, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  /* ---------- REFRESH USER ---------- */
  const refreshUser = async () => {
    if (!token) return;

    const res = await apiRequest("/faculty/me", "GET", null, token);
    setUser(prev => {
      const merged = { ...prev, ...res.user };
      localStorage.setItem("userData", JSON.stringify(merged));
      return merged;
    });
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("profileFormData");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, authChecked, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
