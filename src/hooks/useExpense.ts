import type { AxiosError } from "axios";
import type { SearchByPeriodRequest } from "src/models/purchase";
import type {
    Entry,
    EntryPayload,
    EntryResponse,
    EntryListResponse,
    CustomEntryReceiptInfo,
} from "src/models/entry";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createEntryService,
    updateEntryService,
    deleteEntryService,
    getEntryByIdService,
    getExpenseReceiptService,
    getEntryPaginatedService,
    searchExpensesByPeriodService,
    getCustomExpenseReceiptService,
} from "src/services/entryService";

// Hook para listar despesas paginadas
export const useGetEntriesPaginated = (skip: number, take: number) =>
    useQuery<EntryListResponse, AxiosError>({
        queryKey: ["expenses-list", { skip, take }],
        queryFn: () => getEntryPaginatedService(skip, take),
    });

// Hook para criar uma nova despesa
export const useCreateEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<EntryResponse, AxiosError, EntryPayload>({
        mutationFn: (payload) => createEntryService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["expenses-list"]
            });
        },
    });
};

// Hook para atualizar uma despesa
export const useUpdateEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<EntryResponse, AxiosError, { id: number; data: EntryPayload }>({
        mutationFn: ({ id, data }) => updateEntryService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["expenses-list"]
            });
        },
    });
};

// Hook para deletar uma despesa
export const useDeleteEntry = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteEntryService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["expenses-list"]
            });
        },
    });
};

// Hook para buscar uma despesa por ID
export const useGetEntryById = (id: number) =>
    useQuery<Entry, AxiosError>({
        queryKey: ["expense", id],
        queryFn: () => getEntryByIdService(id),
    });

// Hook para obter recibo de despesa
export const useGetExpenseReceipt = (expenseId: number) =>
    useQuery<Blob, AxiosError>({
        queryKey: ['expense-receipt', expenseId],
        queryFn: () => getExpenseReceiptService(expenseId),
        enabled: !!expenseId,
    });

export const useGenerateCustomExpenseReceipt = () =>
    useMutation<Blob, AxiosError, CustomEntryReceiptInfo>({
        mutationFn: (info) => getCustomExpenseReceiptService(info),
    });

export const useSearchExpensesByPeriod = (payload: SearchByPeriodRequest) =>
    useQuery<Entry[], AxiosError>({
        queryKey: ['expensesByPeriod', payload],
        queryFn: () => searchExpensesByPeriodService(payload.startDate!, payload.endDate!),
        enabled: !!payload?.startDate && !!payload?.endDate,
    });
