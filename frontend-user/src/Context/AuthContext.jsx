import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const res = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          setUser(res.data);
          setToken(savedToken);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    console.error("AuthContext is missing. Ensure the component is wrapped in <AuthProvider>.");
  }
  return context || {}; // Return empty object as fallback to prevent destructuring crash
};
