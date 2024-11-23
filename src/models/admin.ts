export interface Admin {
    id: number;
    login: string;
    password: string;
}

export interface AdminResponse {
    data: Admin;
}

