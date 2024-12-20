import type {
    Expense,
    ExpensePayload,
    ExpenseResponse,
    ExpenseListResponse,
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
