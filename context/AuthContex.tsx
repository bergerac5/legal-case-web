// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

// Define the shape of our decoded token (adjust fields token contain)
interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  role_id: string;
  exp: number; // expiration timestamp
}

// Define what data and functions context provides
interface AuthContextType {
  token: string | null;
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create context with default value
const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

// Provider component that wraps app and provides authentication state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null); // JWT token
  const [user, setUser] = useState<DecodedToken | null>(null); // Decoded user info

  // Function to handle login and store token
  const login = (token: string) => {
    setToken(token); // Save token in state
    localStorage.setItem("access_token", token); // Store token in local storage
    const decoded = jwtDecode<DecodedToken>(token); // Decode token to get user info
    setUser(decoded);
  };

  // Function to clear token and logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
  };

  // Load token on first render (auto-login if token exists)
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      const decoded = jwtDecode<DecodedToken>(storedToken);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        setToken(storedToken);
        setUser(decoded);
      } else {
        logout(); // token expired
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the context
export function useAuth() {
  return useContext(AuthContext);
}
