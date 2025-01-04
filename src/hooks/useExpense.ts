import type { AxiosError } from "axios";
import type {
    Expense,
    ExpensePayload,
    ExpenseResponse,
    ExpenseListResponse,
    CustomExpenseReceiptInfo,
} from "src/models/expense";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createExpenseService,
    updateExpenseService,
    deleteExpenseService,
    getExpenseByIdService,
    getExpenseReceiptService,
    getExpensesPaginatedService,
    getCustomExpenseReceiptService,
} from "src/services/expenseService";

// Hook para listar despesas paginadas
export const useGetExpensesPaginated = (skip: number, take: number) =>
    useQuery<ExpenseListResponse, AxiosError>({
        queryKey: ["expenses-list", { skip, take }],
        queryFn: () => getExpensesPaginatedService(skip, take),
    });

// Hook para criar uma nova despesa
export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<ExpenseResponse, AxiosError, ExpensePayload>({
        mutationFn: (payload) => createExpenseService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["expenses-list"]
            });
        },
    });
};

// Hook para atualizar uma despesa
export const useUpdateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<ExpenseResponse, AxiosError, { id: number; data: ExpensePayload }>({
        mutationFn: ({ id, data }) => updateExpenseService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["expenses-list"]
            });
        },
    });
};

// Hook para deletar uma despesa
export const useDeleteExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteExpenseService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["expenses-list"]
            });
        },
    });
};

// Hook para buscar uma despesa por ID
export const useGetExpenseById = (id: number) =>
    useQuery<Expense, AxiosError>({
        queryKey: ["expense", id],
        queryFn: () => getExpenseByIdService(id),
    });

// Hook para obter recibo de despesa
export const useGetExpenseReceipt = (expenseId: number) =>
    useQuery<Blob, AxiosError>({
        queryKey: ['expense-receipt', expenseId],
        queryFn: () => getExpenseReceiptService(expenseId),
        enabled: !!expenseId,
    });

export const useGetCustomExpenseReceipt = (info: CustomExpenseReceiptInfo) =>
    useQuery<Blob, AxiosError>({
        queryKey: ['custom-expense-receipt', info],
        queryFn: () => getCustomExpenseReceiptService(info),
        enabled: !!info, // Só executa a consulta se 'info' estiver definido
    });