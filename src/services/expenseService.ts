import type {
    Expense,
    ExpensePayload,
    ExpenseResponse,
    ExpenseListResponse,
    CustomExpenseReceiptInfo,
} from "src/models/expense";

import api from "./api";

// Listar despesas paginadas
export const getExpensesPaginatedService = async (skip: number, take: number): Promise<ExpenseListResponse> => {
    const response = await api.get<ExpenseListResponse>("/expenses", { params: { skip, take } });
    return response.data;
};

// Criar uma nova despesa
export const createExpenseService = async (payload: ExpensePayload): Promise<ExpenseResponse> => {
    const response = await api.post<ExpenseResponse>("/expenses", payload);
    return response.data;
};

// Atualizar uma despesa
export const updateExpenseService = async (id: number, payload: ExpensePayload): Promise<ExpenseResponse> => {
    const response = await api.put<ExpenseResponse>(`/expenses?id=${id}`, payload);
    return response.data;
};

// Deletar uma despesa
export const deleteExpenseService = async (id: number): Promise<void> => {
    await api.delete(`/expenses?id=${id}`);
};

// Buscar despesa por ID
export const getExpenseByIdService = async (id: number): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/search/by-id?id=${id}`);
    return response.data;
};

// Obter recibo de Despesa
export const getExpenseReceiptService = async (expenseId: number): Promise<Blob> => {
    const response = await api.get(`/expenses/receipt`, {
        params: { id: expenseId },
        responseType: "blob",
    });
    return response.data;
};

// Obter recibo de despesa Customizado
export const getCustomExpenseReceiptService = async (info: CustomExpenseReceiptInfo): Promise<Blob> => {
    const response = await api.post(`/expenses/receipt/custom`, info, {
        responseType: "blob", 
    });
    return response.data;
};

// Buscar todas as despesas por período
export const searchExpensesByPeriodService = async (startDate: string, endDate: string): Promise<Expense[]> => {
    try {
        const response = await api.get<Expense[]>(`/expenses/search/by-period?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error) {
        console.error('[searchExpensesByPeriodService] Error:', error);
        throw new Error('Error fetching expenses by period.');
    }
};

