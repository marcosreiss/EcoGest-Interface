import api from "./api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
  message: string;
}

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", payload);
    return response.data;
  };