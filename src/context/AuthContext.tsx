import type { ReactNode } from "react";

import { jwtDecode } from "jwt-decode";
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean;
  logout: () => void;
}

interface DecodedToken {
  exp: number; // Campo de expiração (em segundos desde 1970-01-01T00:00:00Z)
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
      localStorage.setItem("authToken", newToken); 
    } else {
      localStorage.removeItem("authToken");
    }
  }, []);

  // Adicione uma verificação de expiração automática assim que o contexto for carregado.
  useEffect(() => {
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Em segundos
      if (decoded.exp <= currentTime) {
        setToken(null); // Remove o token
      } else {
        // Agenda o logout automático para o momento da expiração
        const timeout = (decoded.exp - currentTime) * 1000;
        const timer = setTimeout(() => {
          setToken(null); // Remove o token após expirar
        }, timeout);
  
        return () => clearTimeout(timer); // Limpa o timeout no unmount
      }
    }
    return undefined;
  }, [token, setToken]);
  
  const isAuthenticated = useCallback(() => {
    if(!token) return false;

    // decodifica o token e verifica se ele ainda é válido (24h de validade)
    try{
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch(error){
      console.error("Erro ao decodificar o token:", error);
      return false;
    }
  }, [token]);
  
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
