import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {role: 'user', email, name, password} or null
  const [admin, setAdmin] = useState(null); // {role: 'admin', email} or null
  const [users, setUsers] = useState([]); // Daftar user terdaftar (untuk registrasi)

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("users");
      const storedUser = localStorage.getItem("user");
      const storedAdmin = sessionStorage.getItem("adminSession");

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
          setUser(JSON.parse(storedUser));
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

  const loginUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const loginAdmin = (data) => {
    sessionStorage.setItem("adminSession", JSON.stringify(data));
    setAdmin(data);
  };

  const registerUser = (data) => {
    const newUsers = [...users, data];
    localStorage.setItem("users", JSON.stringify(newUsers));
    setUsers(newUsers);
    loginUser(data);
  };

  const updateUser = (updatedData) => {
    // Update user di localStorage
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Update juga di users array
    const updatedUsers = users.map((u) =>
      u.email === user?.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const logout = () => {
    // Logout hanya menghapus session yang sesuai dengan role
    // User dan admin bisa login bersamaan, jadi logout tidak saling mempengaruhi
    const storedUser = localStorage.getItem("user");
    const storedAdmin = sessionStorage.getItem("adminSession");

    if (storedUser) {
      localStorage.removeItem("user");
      setUser(null);
    }

    if (storedAdmin) {
      sessionStorage.removeItem("adminSession");
      setAdmin(null);
    }
  };

  const logoutUser = () => {
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
    // Return default values jika context belum tersedia
    console.warn("useAuth must be used within AuthProvider");
    return {
      user: null,
      admin: null,
      users: [],
      loginUser: () => {},
      loginAdmin: () => {},
      registerUser: () => {},
      logout: () => {},
    };
  }
  return context;
};
