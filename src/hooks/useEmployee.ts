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
export const useGetEmployeesPaged = () =>
    useQuery<EmployeeListResponse, AxiosError>({
        queryKey: ['employees-list'],
        queryFn: () => getEmployeesPagedService(),
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
export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation<EmployeeResponse, AxiosError, { id: number; data: EmployeePayload }>({
        mutationFn: ({ id, data }) => updateEmployeeService(data, id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['employees-list']}); // Atualiza a lista de funcionários
            queryClient.invalidateQueries({queryKey: ['employee', variables.id]}); // Atualiza detalhes do funcionário específico
        },
    });
};

// Hook para deletar um funcionário
export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteEmployeeService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['employees-list'],
            });
        },
    });
};

// Hook para buscar um funcionário por ID
export const useGetEmployeeById = (id: number) =>
    useQuery<EmployeeResponse, AxiosError>({
        queryKey: ['employee', id],
        queryFn: () => getEmployeeByIdService(id),
    });

export const useGetEmployeeByName = (name: string) =>
    useQuery<Employee[], AxiosError>({
        queryKey: ['employees-by-name', name],
        queryFn: () => getEmployeeByNameService(name),
        enabled: name.length >= 3
    });

// export const useAdvancePayment = () => {
//     const queryClient = useQueryClient();

//     return useMutation<number, AxiosError, number>({
//         mutationFn: (id) => advancePaymentService(id),
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["expenses-list"]
//             });
//         },
//         onMutate: (id) => {
//             console.log("Iniciando adiantamento de pagamento para o funcionário com ID:", id);
//         },
//         onError: (error) => {
//             console.error("Erro ao realizar o adiantamento de pagamento:", error);
//         },
//     });
// };



