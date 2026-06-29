
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.error("Auth init error:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.data.user);
      toast.success("Successfully logged in!");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Login failed");
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.data.user);
      toast.success("Successfully registered!");
      return { success: true };
    } catch (err) {
      toast.error(err.message || "Registration failed");
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

