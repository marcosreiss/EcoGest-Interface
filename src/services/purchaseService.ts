import type {
    Purchase,
    PurchaseResponse,
    PurchaseListResponse,
    CreatePurchasePayload,
    SearchByPeriodRequest,
    TotalPushchasesInPeriodRequest,
    TotalPushchasesInPeriodResponse,
} from "src/models/purchase";

import api from "./api";

// Listar compras paginadas
export const getPurchasesPaginatedService = async (skip: number, take: number): Promise<PurchaseListResponse> => {
    const response = await api.get<PurchaseListResponse>("/purchases", { params: { skip, take } });
    return response.data;
};

// Criar uma nova compra
export const createPurchaseService = async (payload: CreatePurchasePayload): Promise<PurchaseResponse> => {
    const formData = new FormData();

    if (payload.paymentSlip) {
        formData.append("paymentSlip", payload.paymentSlip);
    }

    
    const response = await api.post<PurchaseResponse>("/purchases", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });

    return response.data;
};

// Atualizar uma compra
export const updatePurchaseService = async (id: number, payload: CreatePurchasePayload): Promise<PurchaseResponse> => {
    const formData = new FormData();

    if (payload.paymentSlip) {
        formData.append("paymentSlip", payload.paymentSlip);
    }

    const response = await api.put<PurchaseResponse>(`/purchases?id=${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });

    return response.data;
};

// Deletar uma compra
export const deletePurchaseService = async (id: number): Promise<void> => {
    await api.delete(`/purchases/${id}`);
};

// Buscar compra por ID
export const getPurchaseByIdService = async (id: number): Promise<Purchase> => {
    const response = await api.get<Purchase>(`/purchases/search/by-id?id=${id}`);
    return response.data;
};

// Total de compras em um período
export const getTotalPurchasesInPeriodService = async (
    payload: TotalPushchasesInPeriodRequest
): Promise<TotalPushchasesInPeriodResponse> => {
    const response = await api.post<TotalPushchasesInPeriodResponse>("/purchases/total", payload);
    return response.data;
};


export const searchPurchasesByPeriodService = async (
    payload: SearchByPeriodRequest
): Promise<PurchaseListResponse> => {
    const response = await api.post<PurchaseListResponse>("/search/by-period", payload);
    return response.data;
};
