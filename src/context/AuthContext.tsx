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


// import { createContext, useContext, useEffect, useState } from "react";
// import { apiRequest } from "../lib/api";

// interface User {
//   username?: string;
//   email?: string;
//   profile_completed?: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   authChecked: boolean;
//   login: (user: User, token: string) => void;
//   logout: () => void;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(() => {
//     const saved = localStorage.getItem("userData");
//     return saved ? JSON.parse(saved) : null;
//   });

//   const [token, setToken] = useState<string | null>(
//     localStorage.getItem("token")
//   );

//   const [authChecked, setAuthChecked] = useState(false);

//   /* ---------- VALIDATE USER ---------- */
//   useEffect(() => {
//     const validate = async () => {
//       if (!token) {
//         setAuthChecked(true);
//         return;
//       }

//       try {
//         const res = await apiRequest("/faculty/me", "GET", null, token);

//         setUser(prev => {
//           const merged = { ...prev, ...res.user };
//           localStorage.setItem("userData", JSON.stringify(merged));
//           return merged;
//         });
//       } catch {
//         logout();
//       } finally {
//         setAuthChecked(true);
//       }
//     };

//     validate();
//   }, [token]);

//   /* ---------- LOGIN ---------- */
//   const login = (userData: User, jwt: string) => {
//     setUser(userData);
//     setToken(jwt);
//     localStorage.setItem("token", jwt);
//     localStorage.setItem("userData", JSON.stringify(userData));
//   };

//   /* ---------- REFRESH USER ---------- */
//   const refreshUser = async () => {
//     if (!token) return;

//     const res = await apiRequest("/faculty/me", "GET", null, token);
//     setUser(prev => {
//       const merged = { ...prev, ...res.user };
//       localStorage.setItem("userData", JSON.stringify(merged));
//       return merged;
//     });
//   };

//   /* ---------- LOGOUT ---------- */
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("userData");
//     localStorage.removeItem("profileFormData");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token, authChecked, login, logout, refreshUser }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

/* ================= TYPES ================= */

interface User {
  id?: string;
  username?: string;
  email?: string;
  subjects?: string[];
  stream?: string;
  class_handling?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("faculty_token");

      if (!storedToken) {
        setAuthChecked(true);
        return;
      }

      try {
        const res = await apiRequest(
          "/faculty/me",
          "GET",
          null,
          storedToken
        );

        if (res.status === "success") {
          setUser(res.data);
          setToken(storedToken);
        } else {
          localStorage.removeItem("faculty_token");
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // Don't immediately logout on dev reload/network hiccup
      } finally {
        setAuthChecked(true);
      }
    };

    initializeAuth();
  }, []);

  /* ================= LOGIN ================= */

  const login = async (email: string, password: string) => {
    const res = await apiRequest("/faculty/signin", "POST", {
      email,
      password,
    });

    if (res.status !== "success") {
      throw {
        status: 401,
        message: res.message || "Login failed",
      };
    }

    const accessToken = res.data.access_token;

    if (!accessToken) {
      throw {
        status: 500,
        message: "Access token missing from server",
      };
    }

    // Save token first
    localStorage.setItem("faculty_token", accessToken);
    setToken(accessToken);

    // Fetch user profile
    const profile = await apiRequest(
      "/faculty/me",
      "GET",
      null,
      accessToken
    );

    if (profile.status === "success") {
      setUser(profile.data);
    } else {
      throw {
        status: 500,
        message: "Failed to fetch faculty profile",
      };
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("faculty_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authChecked,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
