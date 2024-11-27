import type { AxiosError } from "axios";
import type { LoginPayload, LoginResponse } from "src/services/loginService";

import { useMutation } from "@tanstack/react-query";

import { loginService } from "src/services/loginService";


// Hook para login
export const useLogin = () =>
  useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: loginService, 
    onMutate: (variables) => {
      console.log("Iniciando a requisição com os dados:", variables);
    },
    onSuccess: (data) => {
      console.log("Resposta da API:", data);
    },
    onError: (error) => {
      console.error("Erro durante a requisição:", error);
    },
  });
