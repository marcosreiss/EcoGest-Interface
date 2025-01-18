import type { AxiosError } from "axios";
import type { LoginPayload, LoginResponse } from "src/services/loginService";

import { useMutation } from "@tanstack/react-query";

import { loginService } from "src/services/loginService";


// Hook para login
export const useLogin = () =>
  useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: loginService, 
  });
