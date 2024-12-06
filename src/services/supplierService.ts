import type {
    Supplier,
    SupplierResponse,
    SupplierListResponse,
    CreateSupplierPayload
} from "src/models/supplier";

import api from "./api";

export const getSuppliersPaginatedService = async (skip: number, take: number): Promise<SupplierListResponse> => {
    const response = await api.get<SupplierListResponse>("/suppliers", { params: { skip, take } });
    return response.data;
};

export const createSupplierService = async (payload: CreateSupplierPayload): Promise<SupplierResponse> => {
    const response = await api.post<SupplierResponse>("/suppliers/create", payload);
    return response.data;
};

// Atualizar fornecedor
export const updateSupplierService = async (payload: Supplier, id: number): Promise<SupplierResponse> => {
    const response = await api.put<SupplierResponse>(`/suppliers?id=${id}`, payload);
    return response.data;
};

// Deletar fornecedor
export const deleteSupplierService = async (id: number): Promise<void> => {
    await api.delete(`/suppliers/?id=${id}`);
};

// Buscar fornecedor por ID
export const getSupplierByIdService = async (id: number): Promise<Supplier> => {
    const response = await api.get<Supplier>(`/suppliers/search/by-id?id=${id}`);
    return response.data;
};

// Buscar fornecedor por nome
export const getSupplierByNameService = async (name: string): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>(`/suppliers/search/by-name?name=${name}`);
    return response.data;
};
