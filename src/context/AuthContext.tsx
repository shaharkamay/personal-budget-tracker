// AuthContext.tsx
import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { GoogleUserType } from "../App";

// Define types
interface User {
  email: string;
  name: string;
  picture: string;
  sub: string;
  // Add other user properties you need
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState<User | null>(userData);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (userData: User): void => {
    setUser(userData);
    setIsAuthenticated(true);
    // You might want to store in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
