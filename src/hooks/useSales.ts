import type { AxiosError } from "axios";
import type { Sale, SaleResponse, SaleListResponse, CreateSalePayload } from "src/models/sale";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createSaleService,
    updateSaleService,
    deleteSaleService,
    getSaleByIdService,
    getSalesPagedService,
    getSalesByProductService,
    getSalesByCustomerService,
} from "src/services/salesService";

// Hook para obter vendas paginadas
export const useGetSalesPaged = (skip: number, take: number) =>
    useQuery<SaleListResponse, AxiosError>({
        queryKey: ['sales-list', { skip, take }],
        queryFn: () => getSalesPagedService(skip, take),
    });

// Hook para criar uma venda
export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation<SaleResponse, AxiosError, CreateSalePayload>({
        mutationFn: (payload) => createSaleService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales-list'],
            });
        }
    });
};

// Hook para atualizar uma venda
export const useUpdateSale = () => {
    const queryClient = useQueryClient();
    return useMutation<SaleResponse, AxiosError, { id: number; data: Partial<CreateSalePayload> }>({
        mutationFn: ({ id, data }) => updateSaleService(data, id),
        onMutate: (variables) => {
            console.log("Atualizando venda com os dados:", variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales-list'],
            });
        }
    });
}

// Hook para deletar uma venda
export const useDeleteSale = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteSaleService(id),
        onMutate: (variables) => {
            console.log("Deletando venda com ID:", variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sales-list'],
            });
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
