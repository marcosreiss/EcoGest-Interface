import type { ReactNode } from "react";

import { jwtDecode } from "jwt-decode";
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";

import { useRouter } from "src/routes/hooks";


interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean | null;
  useLogout: () => void;
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
  const [isLoading, setIsLoading] = useState(true); // Adiciona o estado de carregamento
  const router = useRouter();

  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("authToken", newToken); 
    } else {
      localStorage.removeItem("authToken");
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
  
    if (savedToken) {
      setTokenState(savedToken);
  
      const decoded: DecodedToken = jwtDecode(savedToken);
      const currentTime = Date.now() / 1000;
  
      if (decoded.exp <= currentTime) {
        setToken(null); // Remove o token expirado
        router.push("/");
      } else {
        const timeout = (decoded.exp - currentTime) * 1000;
        const timer = setTimeout(() => {
          setToken(null);
          router.push("/");
        }, timeout);
  
        setIsLoading(false); // Finaliza o carregamento
        return () => clearTimeout(timer);
      }
    } else {
      setIsLoading(false); // Finaliza o carregamento se não houver token
    }
    return undefined;
  }, [setToken, router]);
  
  
  
  const isAuthenticated = useCallback(() => {
    if (isLoading) return null; // Ou outro comportamento, como mostrar um placeholder
    if (!token) return false;
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return false;
    }
  }, [token, isLoading]);
   
  
  const useLogout = useCallback(() => {
    setToken(null);
    router.push("/")
  }, [setToken, router]);
  

  const memorizedValue = useMemo(
    ()=> ({token, setToken, isAuthenticated, useLogout}),
    [token, setToken, isAuthenticated, useLogout]
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
