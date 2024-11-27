import type { ReactNode } from "react";
import type { LoginPayload, LoginResponse} from "src/services/loginService";

import { jwtDecode } from "jwt-decode";
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";

import { useRouter } from "src/routes/hooks";

import { loginService } from "src/services/loginService";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: () => boolean;
  useLogout: () => void;
  useLogin: (payload: LoginPayload) => void;
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
  const router = useRouter();

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
    const savedToken = localStorage.getItem("authToken");
  
    if (savedToken) {
      setTokenState(savedToken);
  
      // Decodifica e verifica o token
      const decoded: DecodedToken = jwtDecode(savedToken);
      const currentTime = Date.now() / 1000; // Em segundos
  
      if (decoded.exp <= currentTime) {
        setToken(null); // Remove o token expirado
        router.push("/");
      } else {
        // Agenda o logout automático para o momento da expiração
        const timeout = (decoded.exp - currentTime) * 1000;
        const timer = setTimeout(() => {
          setToken(null); // Remove o token após expirar
          router.push("/");
        }, timeout);
  
        return () => clearTimeout(timer); // Limpa o timeout no unmount
      }
    }
    return undefined;
  }, [token, setToken, router]);
  
  
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

  const useLogin = useCallback(
    async (payload: LoginPayload): Promise<LoginResponse> => {
      try {
        const response = await loginService(payload);
        if (response?.token) {
          setToken(response.token); // Define o token no contexto
        } else {
          throw new Error("Token ausente na resposta do login");
        }
        return response;
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        setToken(null); // Remove qualquer token existente, garantindo estado consistente
        throw error; // Propaga o erro para tratamento no componente que chamou
      }
    },
    [setToken]
  );
  
  
  const useLogout = useCallback(() => {
    setToken(null);
  }, [setToken]);
  

  const memorizedValue = useMemo(
    ()=> ({token, setToken, isAuthenticated, useLogout, useLogin}),
    [token, setToken, isAuthenticated, useLogout, useLogin]
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
