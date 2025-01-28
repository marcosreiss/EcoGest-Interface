import type { FilterParams } from "src/models/filterParams";
import type { Sale, SalePayload, SaleResponse, SaleListResponse, CustomSaleReceiptInfo } from "src/models/sale";

import api from "./api";

// Obter vendas paginadas
export const getSalesPagedService = async (params: FilterParams): Promise<SaleListResponse> => {
    console.log(params);
    const response = await api.get<SaleListResponse>("/sales", { params });
    return response.data;
};

// Criar uma nova venda
export const createSaleService = async (payload: SalePayload): Promise<SaleResponse> => {
    console.log(payload);
    
    const response = await api.post<SaleResponse>("/sales", payload);
    return response.data;
};

// Atualizar uma venda
export const updateSaleService = async (payload: Partial<SalePayload>, saleId: number): Promise<SaleResponse> => {
    const response = await api.put<SaleResponse>(`/sales?id=${saleId}`, payload);
    return response.data;
};

// Deletar uma venda
export const deleteSaleService = async (saleId: number): Promise<void> => {
    await api.delete(`/sales?id=${saleId}`);
};

// Buscar venda por ID
export const getSaleByIdService = async (saleId: number): Promise<Sale> => {
    const response = await api.get<Sale>(`sales/search/by-id?id=${saleId}`);
    return response.data;
};

// Buscar vendas por cliente
export const getSalesByCustomerService = async (customerId: number): Promise<SaleListResponse> => {
    const response = await api.get<SaleListResponse>(`/sales/customer?customerId=${customerId}`);
    return response.data;
};

// Buscar vendas por produto
export const getSalesByProductService = async (productId: number): Promise<SaleListResponse> => {
    const response = await api.get<SaleListResponse>(`/sales/product?productId=${productId}`);
    return response.data;
};

// Obter recibo da venda
export const getSaleReceiptService = async (saleId: number): Promise<Blob> => {
    const response = await api.get(`/sales/receipt`, {
        params: { id: saleId },
        responseType: "blob",
    });
    return response.data;
};

// Obter recibo de venda Customizado
export const getCustomSaleReceiptService = async (info: CustomSaleReceiptInfo): Promise<Blob> => {
    const response = await api.post(`/sales/receipt/custom`, info, {
        responseType: "blob", 
    });
    return response.data;
};

// buscar todas as vendas por período
export const searchSalesByPeriodService = async (startDate: string, endDate: string): Promise<SaleListResponse> => {
    try {
        const response = await api.get<SaleListResponse>(`/sales/period?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error) {
        console.error('[searchSalesByPeriodService] Error:', error);
        throw new Error('Error fetching sales by period.');
    }
};

// atualizar status de uma venda (aprovada ou cancelada)
export const updateSaleStatusService = async (saleId: number, saleStatus: 'processing' | 'approved' | 'canceled'): Promise<number> => {
    const response = await api.put(`/sales/status?id=${saleId}`, { saleStatus });
    return response.status;
};