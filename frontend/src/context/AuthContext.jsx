// ========================================
// AUTH CONTEXT
// src/context/AuthContext.jsx
// ========================================

import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      toast.success("Registration successful!");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success("Login successful!");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Logged out successfully");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
