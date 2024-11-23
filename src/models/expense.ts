export interface Expense {
    id: number;
    type: string;
    value: number;
    description?: string | null;
    purchaseId: number;
}

export interface ExpenseListResponse {
    data: Expense[];
}

export interface ExpenseResponse {
    data: Expense;
}

export interface CreateExpensePayload{
    type: string;
    value: number;
    description?: string | null;
    purchaseId: number;
}