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
    day?: number;
    week?: any;
    month?: number;
    year?: number;
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



