export interface Admin {
    id: number;
    login: string;
    password: string;
}

export interface AdminListResponse {
    data: Admin[];
}

export interface AdminResponse {
    data: Admin;
}
