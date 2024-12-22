import type { Product } from "./product";


export interface TopProduct {
    productId: number;
    totalSold: string;
    product: Product;
}

export interface RevenueByCustomer {
    customerId: number;
    totalSpent: string;
    customer: {
        name: string;
    };
}

export interface RevenueByProduct {
    productId: number;
    totalRevenue: string;
    product: Product;
}

export interface TotalSalesApprovedData {
    totalSalesApproved: string;
}

export interface SalesKpiResponse {
    data: {
        totalSalesApprovedData: TotalSalesApprovedData[];
        approvedSalesCount: number;
        topProducts: TopProduct[];
        revenueByCustomer: RevenueByCustomer[];
        salesCancellationRate: number;
        avgProcessingTimeSales: number;
        revenueByProduct: RevenueByProduct[];
    };
    meta: {
        startDate: string;
        endDate: string;
        period: string | null;
        productId: number | null;
        supplierId: number | null;
        stackBy: string | null;
    };
}

export enum TimeGranularity {
    Day = "day",
    Week = "week",
    Month = "month",
    Year = "year"
}

export enum StackBy {
    Supplier = "fornecedor",
    Product = "produto"
}

export interface SalesKpiParams{
    startDate?: string,
    endDate?: string,
    productId?: number,
    supplierId?: number,
    period?: TimeGranularity,
    stackBy?: StackBy
}