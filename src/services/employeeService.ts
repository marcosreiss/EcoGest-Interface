import type {
    Employee,
    EmployeePayload,
    EmployeeResponse,
    EmployeeListResponse,
} from "src/models/employee";

import api from "./api";

// Serviço para buscar funcionários paginados
export const getEmployeesPagedService = async (skip: number, take: number): Promise<EmployeeListResponse> => {
    const response = await api.get<EmployeeListResponse>("/employees", { params: { skip, take } });
    return response.data;
};

// Serviço para criar um novo funcionário
export const createEmployeeService = async (payload: EmployeePayload): Promise<EmployeeResponse> => {
    const response = await api.post<EmployeeResponse>("/employees", payload);
    return response.data;
};

// Serviço para atualizar um funcionário
export const updateEmployeeService = async (employee: EmployeePayload, id: number): Promise<EmployeeResponse> => {
    const response = await api.put<EmployeeResponse>(`/employees?id=${id}`, employee);
    return response.data;
};

// Serviço para deletar um funcionário
export const deleteEmployeeService = async (id: number): Promise<void> => {
    await api.delete(`/employees?id=${id}`);
};

// Serviço para buscar um funcionário por ID
export const getEmployeeByIdService = async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/search/by-id?id=${id}`);
    return response.data;
};