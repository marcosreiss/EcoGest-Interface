import ReactDOM from "react-dom/client";
import { Suspense, StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import SnackBarComponent from "./components/snack-bar/snackBar";
import { NotificationProvider } from "./context/NotificationContext";


// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

// Inicialize o QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Tenta novamente em caso de falha (padrão: 3)
      refetchOnWindowFocus: false, // Não refaz a consulta ao mudar o foco para a janela
      staleTime: 1000 * 60 * 15, // Considera os dados frescos por 15 minutos
    },
  },
});


root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AuthProvider>
            <NotificationProvider>
              <SnackBarComponent />
              <Suspense>
                <App />
              </Suspense>
            </NotificationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>

);


