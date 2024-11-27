import type { ReactNode } from "react";
import type { LoginPayload, LoginResponse} from "src/services/loginService";

import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";

import { useRouter } from "src/routes/hooks";

import { loginService, logoutService, checkAuthService } from "src/services/loginService";

interface AuthContextType {
  isAuthenticated: boolean;
  useLogout: () => void;
  useLogin: (payload: LoginPayload) => Promise<LoginResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();



  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("Chamando checkAuthentication...");
        
        const response = await checkAuthService();
      
        if (response.status === 200) {
          setIsAuthenticated(true);
          router.push('/'); 
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro durante a verificação de autenticação:', error);
        setIsAuthenticated(false);
      };
      
    };
  
    if (!isAuthenticated) {
      checkAuthentication();
    }
  }, [isAuthenticated, router]);

  const useLogin = useCallback(async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      console.log("chamando useLogin");
      
      const response = await loginService(payload);
      setIsAuthenticated(true);
      router.push("/");
      return response;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setIsAuthenticated(false);
      throw error;
    }
  }, [router]);
  
  const useLogout = useCallback(async () => {
    try {
      console.log("chamando useLogut");
      await logoutService();
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, [router]);
  

  const memorizedValue = useMemo(
    () => ({ isAuthenticated, useLogout, useLogin }),
    [isAuthenticated, useLogout, useLogin]
  );  

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

