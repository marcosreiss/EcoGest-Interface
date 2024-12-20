export interface Expense {
    expenseId: number;
    purchasesId?: null;
    employeeId?: number;
    type: string;
    value: number;
    description?: string | null;
    weightAmount?: number;
}

export interface ExpenseListResponse {
    data: Expense[];
}

export interface ExpenseResponse {
    data: Expense;
}

export interface ExpensePayload{
    expenseId?: number;
    purchasesId?: null;
    employeeId?: number;
    type: string;
    value: number;
    description?: string | null;
    weightAmount: number;
}