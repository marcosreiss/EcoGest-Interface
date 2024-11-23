export interface Employee {
    id: number;
    name: string;
    login: string;
    password: string;
    role: string;
}

export interface EmployeeListResponse {
    data: Employee[];
}

export interface EmployeeResponse {
    data: Employee;
}

export interface CreateEmployeePayload{
    name: string;
    login: string;
    password: string;
    role: string;
}