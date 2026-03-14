import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS = [
  { id: "1", name: "Alex Morgan", email: "admin@stockflow.com", password: "password", role: "Admin" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sf_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem("sf_user", JSON.stringify(userData));
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser = { id: Date.now().toString(), name, email, role: "Operator" };
    setUser(newUser);
    localStorage.setItem("sf_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sf_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
