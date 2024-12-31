export interface Expense {
    expenseId: number;
    purchasesId?: number;
    employeeId?: number;
    type: string;
    description?: string | null;
    price?: number;
}

export interface ExpenseListResponse {
    data: Expense[];
    meta: any;
}

export interface ExpenseResponse {
    data: Expense;
}

export interface ExpensePayload{
    type: string;
    description?: string | null;
    price: number;
}