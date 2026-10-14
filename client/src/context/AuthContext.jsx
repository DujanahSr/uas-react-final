import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {role: 'user', email, name, ...} or null
  const [admin, setAdmin] = useState(null); // {role: 'admin', email} or null
  const [users, setUsers] = useState([]); // Daftar user terdaftar (untuk registrasi lokal / fallback)

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("users");
      const storedUser = localStorage.getItem("user");
      const storedAdmin = sessionStorage.getItem("adminSession");
      const token = localStorage.getItem("token");

      if (storedUsers) {
        try {
          setUsers(JSON.parse(storedUsers));
        } catch (e) {
          console.error("Error parsing users:", e);
          localStorage.removeItem("users");
        }
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // If token exists, asynchronously verify session with Go API
          if (token) {
            authApi
              .getProfile()
              .then((res) => {
                if (res?.data) {
                  const updated = {
                    ...parsedUser,
                    ...res.data,
                    role: res.data.role === "SUPER_ADMIN" ? "admin" : "user",
                  };
                  setUser(updated);
                  localStorage.setItem("user", JSON.stringify(updated));
                }
              })
              .catch((err) => {
                console.warn("Session check fallback to local:", err.message);
              });
          }
        } catch (e) {
          console.error("Error parsing user:", e);
          localStorage.removeItem("user");
        }
      }

      if (storedAdmin) {
        try {
          setAdmin(JSON.parse(storedAdmin));
        } catch (e) {
          console.error("Error parsing admin:", e);
          sessionStorage.removeItem("adminSession");
        }
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    }
  }, []);

  const loginUser = async (credentials) => {
    // If credentials already has full user object without password (e.g. from internal callers)
    if (credentials && !credentials.password && credentials.email) {
      localStorage.setItem("user", JSON.stringify(credentials));
      setUser(credentials);
      return credentials;
    }

    try {
      // 1. Try backend Go API authentication
      const res = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        const userData = {
          ...res.data.user,
          role: res.data.user.role === "SUPER_ADMIN" ? "admin" : "user",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (apiErr) {
      console.warn("Backend API login failed, checking fallback:", apiErr.message);

      // If backend returned invalid credentials error explicitly, re-throw
      if (
        apiErr.message.includes("salah") ||
        apiErr.message.includes("tidak terdaftar") ||
        apiErr.message.includes("invalid")
      ) {
        // Still check local registered users before throwing
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const found = storedUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (found) {
          localStorage.setItem("user", JSON.stringify(found));
          setUser(found);
          return found;
        }
        throw apiErr;
      }

      // 2. Offline / Mock fallback
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const found = storedUsers.find((u) => u.email === credentials.email);
      if (found) {
        if (found.password === credentials.password) {
          localStorage.setItem("user", JSON.stringify(found));
          setUser(found);
          return found;
        } else {
          throw new Error("Password salah");
        }
      } else {
        throw new Error(apiErr.message || "Email tidak terdaftar. Silakan daftar terlebih dahulu.");
      }
    }
  };

  const loginAdmin = async (credentials) => {
    // Standard mock admin or backend API
    try {
      const res = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        const adminData = {
          ...res.data.user,
          role: "admin",
        };
        sessionStorage.setItem("adminSession", JSON.stringify(adminData));
        setAdmin(adminData);
        return adminData;
      }
    } catch (e) {
      console.warn("Admin API login fallback:", e.message);
    }

    // Fallback hardcoded admin
    sessionStorage.setItem("adminSession", JSON.stringify(credentials));
    setAdmin(credentials);
    return credentials;
  };

  const registerUser = async (data) => {
    let registeredUser = null;
    try {
      // 1. Try Go backend API registration
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || "08123456789",
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        registeredUser = {
          ...res.data.user,
          role: res.data.user.role === "SUPER_ADMIN" ? "admin" : "user",
          address: data.address || "",
        };
      }
    } catch (apiErr) {
      console.warn("Backend register API failed, saving locally:", apiErr.message);
    }

    // 2. Also ensure local users list is updated for resilience
    const fallbackUser = registeredUser || {
      role: "user",
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
    };

    const newUsers = [...users.filter((u) => u.email !== data.email), fallbackUser];
    localStorage.setItem("users", JSON.stringify(newUsers));
    setUsers(newUsers);

    localStorage.setItem("user", JSON.stringify(fallbackUser));
    setUser(fallbackUser);

    return fallbackUser;
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    const updatedUsers = users.map((u) =>
      u.email === user?.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("adminSession");
    setUser(null);
    setAdmin(null);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("adminSession");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        users,
        loginUser,
        loginAdmin,
        registerUser,
        updateUser,
        logout,
        logoutUser,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("useAuth must be used within AuthProvider");
    return {
      user: null,
      admin: null,
      users: [],
      loginUser: async () => {},
      loginAdmin: async () => {},
      registerUser: async () => {},
      logout: () => {},
    };
  }
  return context;
};
