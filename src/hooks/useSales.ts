import type { AxiosError } from "axios";
import type { FilterParams } from "src/models/filterParams";
import type { ApiErrorResponse } from "src/models/errorResponse";
import type { Sale, SalePayload, SaleResponse, SaleListResponse, CustomSaleReceiptInfo } from "src/models/sale";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createSaleService,
    updateSaleService,
    deleteSaleService,
    getSaleByIdService,
    getSalesPagedService,
    getSaleReceiptService,
    updateSaleStatusService,
    getSalesByProductService,
    getSalesByCustomerService,
    searchSalesByPeriodService,
    getCustomSaleReceiptService,
} from "src/services/saleService";

// Hook para obter vendas paginadas
export const useGetSalesPaged = (params: FilterParams) =>
    useQuery<SaleListResponse, AxiosError>({
        queryKey: ['sales-list', { params }],
        queryFn: () => getSalesPagedService(params),
    });

// Hook para criar uma venda
export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation<SaleResponse, AxiosError<ApiErrorResponse>, SalePayload>({
        mutationFn: (payload) => createSaleService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales-list'],
            });
            queryClient.invalidateQueries({queryKey: ["recives-list"],});
        }
    });
};

// Hook para atualizar uma venda
export const useUpdateSale = () => {
    const queryClient = useQueryClient();
    return useMutation<SaleResponse, AxiosError<ApiErrorResponse>, { id: number; data: Partial<SalePayload> }>({
        mutationFn: ({ id, data }) => updateSaleService(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales-list'],
            });
            queryClient.invalidateQueries({queryKey: ["recives-list"],});
        }
    });
}

// Hook para deletar uma venda
export const useDeleteSale = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteSaleService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales-list'],
            });
            queryClient.invalidateQueries({queryKey: ["recives-list"],});
        }
    });
};

// Hook para buscar uma venda por ID
export const useGetSaleById = (id: number) =>
    useQuery<Sale, AxiosError>({
        queryKey: ['sale', id],
        queryFn: () => getSaleByIdService(id),
    });

// Hook para buscar vendas por cliente
export const useGetSalesByCustomer = (customerId: number) =>
    useQuery<SaleListResponse, AxiosError>({
        queryKey: ['sales-by-customer', customerId],
        queryFn: () => getSalesByCustomerService(customerId),
    });

// Hook para buscar vendas por produto
export const useGetSalesByProduct = (productId: number) =>
    useQuery<SaleListResponse, AxiosError>({
        queryKey: ['sales-by-product', productId],
        queryFn: () => getSalesByProductService(productId),
    });

// Hook para obter recibo de venda
export const useGetSaleReceipt = (saleId: number) =>
    useQuery<Blob, AxiosError>({
        queryKey: ['sale-receipt', saleId],
        queryFn: () => getSaleReceiptService(saleId),
        enabled: !!saleId,
    });

// Hook para obter recibo de venda customizado
export const useGenerateCustomSaleReceipt = () =>
    useMutation<Blob, AxiosError, CustomSaleReceiptInfo>({
      mutationFn: (info) => getCustomSaleReceiptService(info),
    });

export const useSearchSalesByPeriod = (payload: FilterParams) =>
    useQuery<SaleListResponse, AxiosError>({
        queryKey: ['salesByPeriod', payload],
        queryFn: () => searchSalesByPeriodService(payload.startDate!, payload.endDate!),
        enabled: !!payload?.startDate && !!payload?.endDate,
    });

export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<number, AxiosError, { id: number; saleStatus: 'processing' | 'approved' | 'canceled' }>({
        mutationFn: ({ id, saleStatus }) => updateSaleStatusService(id, saleStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales-list'] });
        },
        onError: (error) => {
            console.error("Erro ao atualizar o status da venda:", error);
        },
    });
};
