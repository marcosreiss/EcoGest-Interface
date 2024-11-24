import type { ReactNode} from "react";

import React, { useMemo, useState, useContext, createContext } from "react";

// Define a interface para o contexto de autenticação
interface AuthContextType {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

// Inicializa o contexto com valores padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Define a interface para as props do provider
interface AuthProviderProps {
  children: ReactNode;
}

// Componente Provider para passar os valores do contexto
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(false);

    // Memoiza o objeto para evitar re-renderizações desnecessárias
    const contextValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto com segurança
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

 export { useAuth, AuthProvider };
