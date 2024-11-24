import type { ReactNode } from "react";

import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setTokenState(savedToken);
    }
  }, []);


  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("authToken", newToken); // Salva o token no localStorage
    } else {
      localStorage.removeItem("authToken"); // Remove o token no logout
    }
  }, []);
  
  const isAuthenticated = useCallback(() => !!token, [token]);
  
  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);
  

  const memorizedValue = useMemo(
    ()=> ({token, setToken, isAuthenticated, logout}),
    [token, setToken, isAuthenticated, logout]
  )

  return (
    <AuthContext.Provider value={memorizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
