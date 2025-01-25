import type {
    Entry,
    EntryPayload,
    EntryResponse,
    EntryListResponse,
    EntryPaginatedParams,
    CustomEntryReceiptInfo,
    EntryRelatoryRequestParams,
} from "src/models/entry";

import api from "./api";

// Listar despesas paginadas
export const getEntryPaginatedService = async (params: EntryPaginatedParams): Promise<EntryListResponse> => {
    const response = await api.get<EntryListResponse>("/entry", { params });
    return response.data;
};

// Criar uma nova despesa
export const createEntryService = async (payload: EntryPayload): Promise<EntryResponse> => {
    console.log(payload);
    const response = await api.post<EntryResponse>("/entry", payload);
    return response.data;
};

// Atualizar uma despesa
export const updateEntryService = async (id: number, payload: EntryPayload): Promise<EntryResponse> => {
    const response = await api.put<EntryResponse>(`/entry?id=${id}`, payload);
    return response.data;
};

// Deletar uma despesa
export const deleteEntryService = async (id: number): Promise<void> => {
    await api.delete(`/entry?id=${id}`);
};

// Buscar despesa por ID
export const getEntryByIdService = async (id: number): Promise<Entry> => {
    const response = await api.get<Entry>(`/entry/search/by-id?id=${id}`);
    return response.data;
};

// Obter recibo de Despesa por ID
export const getEntryReceiptService = async (id: number): Promise<Blob> => {
    const response = await api.get<Blob>(`/entry/receipt?id=${id}`, {
        responseType: "blob",
    });
    return response.data;
};

// Obter recibo de despesa Customizado
export const getCustomEntryReceiptService = async (info: CustomEntryReceiptInfo): Promise<Blob> => {
    const response = await api.post(`/entry/receipt/custom`, info, {
        responseType: "blob",
    });
    return response.data;
};

// Buscar todas as despesas por período
export const searchExpensesByPeriodService = async (startDate: string, endDate: string): Promise<Entry[]> => {
    try {
        const response = await api.get<Entry[]>(`/expenses/search/by-period?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error) {
        console.error('[searchExpensesByPeriodService] Error:', error);
        throw new Error('Error fetching expenses by period.');
    }
};

export const getEntryRelatoryService = async (params: EntryRelatoryRequestParams): Promise<Blob> => {
    const response = await api.get("/entry/relatory", {
        params,
        responseType: "blob",
    });
    return response.data;
};
