import type { Sale, SaleResponse, SaleListResponse, CreateSalePayload } from "src/models/sale";

import api from "./api";

// Obter vendas paginadas
export const getSalesPagedService = async (skip: number, take: number): Promise<SaleListResponse> => {
    const response = await api.get<SaleListResponse>("/sales", { params: { skip, take } });
    return response.data;
};

// Criar uma nova venda
export const createSaleService = async (payload: CreateSalePayload): Promise<SaleResponse> => {
    const response = await api.post<SaleResponse>("/sales/create", payload);
    return response.data;
};

// Atualizar uma venda
export const updateSaleService = async (payload: Partial<CreateSalePayload>, saleId: number): Promise<SaleResponse> => {
    const response = await api.put<SaleResponse>(`/sales/${saleId}`, payload);
    return response.data;
};

// Deletar uma venda
export const deleteSaleService = async (saleId: number): Promise<void> => {
    await api.delete(`/sales/${saleId}`);
};

// Buscar venda por ID
export const getSaleByIdService = async (saleId: number): Promise<Sale> => {
    const response = await api.get<Sale>(`/sales/${saleId}`);
    return response.data;
};

// Buscar vendas por cliente
export const getSalesByCustomerService = async (customerId: number): Promise<SaleListResponse> => {
    const response = await api.get<SaleListResponse>(`/sales/customer/${customerId}`);
    return response.data;
};

// Buscar vendas por produto
export const getSalesByProductService = async (productId: number): Promise<SaleListResponse> => {
    const response = await api.get<SaleListResponse>(`/sales/product/${productId}`);
    return response.data;
};
