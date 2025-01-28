import type { AxiosError } from "axios";
import type { FilterParams } from "src/models/filterParams";
import type {
    Purchase,
    PurchasePayload,
    PurchaseResponse,
    PurchaseListResponse,
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
    getPurchasesByProductService,
    getPurchasesBySupplierService,
    searchPurchasesByPeriodService,
    getTotalPurchasesInPeriodService,
} from "src/services/purchaseService";

// Hook para listar compras paginadas
export const useGetPurchasesPaginated = (params: FilterParams) =>
    useQuery<PurchaseListResponse, AxiosError>({
        queryKey: ["purchases-list", { params }],
        queryFn: () => getPurchasesPaginatedService(params),
    });

// Hook para criar uma nova compra
export const useCreatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation<PurchaseResponse, AxiosError, PurchasePayload>({
        mutationFn: (payload) => createPurchaseService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["purchases-list"]});
            queryClient.invalidateQueries({ queryKey: ['paybles-list'] });
        },
    });
};

// Hook para atualizar uma compra
export const useUpdatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation<PurchaseResponse, AxiosError, { id: number; data: PurchasePayload }>({
        mutationFn: ({ id, data }) => updatePurchaseService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["purchases-list"]
            });
            queryClient.invalidateQueries({ queryKey: ['paybles-list'] });
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
            queryClient.invalidateQueries({ queryKey: ['paybles-list'] });
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

export const useSearchPurchasesByPeriod = (payload: FilterParams) =>
    useQuery<Purchase[], AxiosError>({
        queryKey: ['purchasesByPeriod', payload],
        queryFn: () => searchPurchasesByPeriodService(payload.startDate!, payload.endDate!),
        enabled: !!payload?.startDate && !!payload?.endDate,
    });

// Hook para buscar compras por fornecedor
export const useGetPurchasesBySupplier = (supplierId: number) =>
    useQuery<PurchaseListResponse, AxiosError>({
        queryKey: ["purchases-by-supplier", supplierId],
        queryFn: () => getPurchasesBySupplierService(supplierId),
        enabled: !!supplierId, // Evita chamadas desnecessárias se supplierId for inválido
    });

// Hook para buscar compras por produto
export const useGetPurchasesByProduct = (productId: number) =>
    useQuery<PurchaseListResponse, AxiosError>({
        queryKey: ["purchases-by-product", productId],
        queryFn: () => getPurchasesByProductService(productId),
        enabled: !!productId, // Evita chamadas desnecessárias se productId for inválido
    });

// export const useUpdatePurchaseStatus = () => {
//     const queryClient = useQueryClient();

//     return useMutation<number, AxiosError, { id: number; purchaseStatus: PurchaseStatus }>({
//         mutationFn: ({ id, purchaseStatus }) => updatePurchaseStatusService(id, purchaseStatus),
//         onSuccess: () => {
//             queryClient.invalidateQueries({
//                 queryKey: ["purchases-list"]
//             });
//         },
//         onError: (error) => {
//             console.error("Erro ao atualizar o status da compra:", error);
//         },
//     });
// };
