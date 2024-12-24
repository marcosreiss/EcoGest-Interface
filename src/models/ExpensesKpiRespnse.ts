export interface TotalExpensesData {
    totalExpenses: string;
    day?: number;
    week?: any;
    month?: number;
    year?: number;
}

export interface ExpenseTypeDistribution {
    type: string; // Tipo de despesa (e.g., "supplier", "employee")
    totalByType: number; // Total por tipo de despesa
    percentage: number; // Porcentagem em relação ao total
}

export interface ExpensesKpiResponse {
    data: {
        totalExpensesData: TotalExpensesData[];
        totalEmployeeCost: number; // Custo total com funcionários
        expenseTypeDistribution: ExpenseTypeDistribution[]; // Distribuição dos tipos de despesas
    };
    meta: {
        startDate: string | null;
        endDate: string | null;
        period: string | null;
        productId: number | null;
        supplierId: number | null;
    };
}