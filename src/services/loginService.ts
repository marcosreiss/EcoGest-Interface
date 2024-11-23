import type { LoginPayload, LoginResponse } from "src/models/login";

import api from "./api";


export const userAuthentication = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data;
  };
  