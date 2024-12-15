import type { AxiosError } from "axios";
import type { Employee, EmployeePayload, EmployeeResponse, EmployeeListResponse } from "src/models/employee";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createEmployeeService,
    updateEmployeeService,
    deleteEmployeeService,
    getEmployeeByIdService,
    getEmployeesPagedService,
    getEmployeeByNameService,
} from "src/services/employeeService"; // Ajuste o path se necessário

// Hook para buscar funcionários paginados
export const useGetEmployeesPaged = (skip: number, take: number) =>
    useQuery<EmployeeListResponse, AxiosError>({
        queryKey: ['employees-list', { skip, take }],
        queryFn: () => getEmployeesPagedService(skip, take),
    });

// Hook para criar um novo funcionário
export const useCreateEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation<EmployeeResponse, AxiosError, EmployeePayload>({
        mutationFn: (payload) => createEmployeeService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['employees-list'],
            });
        },
    });
};

// Hook para atualizar um funcionário
export const useUpdateEmployee = () =>
    useMutation<EmployeeResponse, AxiosError, { id: number; data: EmployeePayload }>({
        mutationFn: ({ id, data }) => updateEmployeeService(data, id),
        onMutate: (variables) => {
            console.log("Atualizando funcionário com os dados:", variables);
        },
    });

// Hook para deletar um funcionário
export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteEmployeeService(id),
        onMutate: (variables) => {
            console.log("Deletando funcionário com ID:", variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['employees-list'],
            });
        },
    });
};

// Hook para buscar um funcionário por ID
export const useGetEmployeeById = (id: number) =>
    useQuery<Employee, AxiosError>({
        queryKey: ['employee', id],
        queryFn: () => getEmployeeByIdService(id),
    });

export const useGetEmployeeByName = (name: string) =>
    useQuery<Employee[], AxiosError>({
        queryKey: ['employees-by-name', name],
        queryFn: () => getEmployeeByNameService(name),
        enabled: name.length >= 3
    });

