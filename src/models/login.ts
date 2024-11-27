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