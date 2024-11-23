import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { userAuthentication } from "src/services/loginService";

import type { LoginPayload, LoginResponse } from "../models/login";

// Hook para login
export const useLogin = () =>
  useMutation<LoginResponse, AxiosError, LoginPayload>({
    mutationFn: userAuthentication, 
  });
