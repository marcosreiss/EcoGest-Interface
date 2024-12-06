import type { AxiosError } from "axios";
import type {
    Supplier,
    SupplierResponse,
    SupplierListResponse,
    CreateSupplierPayload
} from "src/models/supplier";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
    createSupplierService,
    updateSupplierService,
    deleteSupplierService,
    getSupplierByIdService,
    getSupplierByNameService,
    getSuppliersPaginatedService,
} from "src/services/supplierService";

export const useGetSuppliersPaginated = (skip: number, take: number) =>
    useQuery<SupplierListResponse, AxiosError>({
        queryKey: ['suppliers-list', { skip, take }],
        queryFn: () => getSuppliersPaginatedService(skip, take),
    });

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation<SupplierResponse, AxiosError, CreateSupplierPayload>({
        mutationFn: (payload) => createSupplierService(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['suppliers-list'],
            });
        }
    });
};

export const useUpdateSupplier = () =>
    useMutation<SupplierResponse, AxiosError, { id: number; data: Supplier }>({
        mutationFn: ({ id, data }) => updateSupplierService(data, id),
        onMutate: (variables) => {
            console.log("Atualizando fornecedor com os dados:", variables);
        },
        onSuccess: () => {
            // Invalida a lista caso seja necessário atualizar a tabela de fornecedores
            // queryClient.invalidateQueries({ queryKey: ['suppliers-list'] });
        }
    });

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, number>({
        mutationFn: (id) => deleteSupplierService(id),
        onMutate: (variables) => {
            console.log("Deletando fornecedor com ID:", variables);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['suppliers-list'],
            });
        }
    });
};

export const useGetSupplierById = (id: number) =>
    useQuery<Supplier, AxiosError>({
        queryKey: ['supplier', id],
        queryFn: () => getSupplierByIdService(id),
    });

export const useGetSupplierByName = (name: string) =>
    useQuery<Supplier[], AxiosError>({
        queryKey: ['suppliers-by-name', name],
        queryFn: () => getSupplierByNameService(name),
        enabled: name.length >= 3
    });
