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
    meta: any;
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