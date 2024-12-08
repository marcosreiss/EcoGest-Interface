import type { AxiosError } from "axios";
import type {
    Purchase,
    PurchaseResponse,
    PurchaseListResponse,
    CreatePurchasePayload,
    SearchByPeriodRequest,
    TotalPushchasesInPeriodRequest,
    TotalPushchasesInPeriodResponse,
} from "src/models/purchase";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createPurchaseService,
    updatePurchaseService,
    deletePurchaseService,
    getPurchaseByIdService,
    getPurchasesPaginatedService,
    searchPurchasesByPeriodService,
    getTotalPurchasesInPeriodService,
} from "src/services/purchaseService";

// Hook para listar compras paginadas
export const useGetPurchasesPaginated = (skip: number, take: number) =>
    useQuery<PurchaseListResponse, AxiosError>({
        queryKey: ["purchases-list", { skip, take }],
        queryFn: () => getPurchasesPaginatedService(skip, take),
    });

// Hook para criar uma nova compra
export const useCreatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation<PurchaseResponse, AxiosError, CreatePurchasePayload>({
        mutationFn: (payload) => createPurchaseService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["purchases-list"]
            });
        },
    });
};

// Hook para atualizar uma compra
export const useUpdatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation<PurchaseResponse, AxiosError, { id: number; data: CreatePurchasePayload }>({
        mutationFn: ({ id, data }) => updatePurchaseService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["purchases-list"]
            });
        },
    });
};

// Hook para deletar uma compra
export const useDeletePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deletePurchaseService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["purchases-list"]
            });
        },
    });
};

// Hook para buscar uma compra por ID
export const useGetPurchaseById = (id: number) =>
    useQuery<Purchase, AxiosError>({
        queryKey: ["purchase", id],
        queryFn: () => getPurchaseByIdService(id),
    });

// Hook para calcular o total de compras em um período
export const useGetTotalPurchasesInPeriod = () =>
    useMutation<TotalPushchasesInPeriodResponse, AxiosError, TotalPushchasesInPeriodRequest>({
        mutationFn: (payload) => getTotalPurchasesInPeriodService(payload),
    });

export const useSearchPurchasesByPeriod = () =>
    useMutation<PurchaseListResponse, AxiosError, SearchByPeriodRequest>({
        mutationFn: (payload) => searchPurchasesByPeriodService(payload),
    });
