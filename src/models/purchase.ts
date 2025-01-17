import type { Person } from "./person";
import type { Product } from "./product";

export interface Purchase {
    purchaseId: number;
    supplier: Person;
    products: PurchaseProduct[];
    description?: string | null;
    date_time: string;
    paymentSlip: { data: number[] } | null;
    discount: number;
    totalPrice: number;
}

export interface PurchasePayload {
    personId: number;
    products: PurchasePayloadProduct[];
    description?: string | null;
    date_time: string;
    paymentSlip: Blob | null;
    discount: number | null;
}

export interface PurchaseProduct {
    productId: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface PurchasePayloadProduct {
    productId: number;
    quantity: number;
    price: number;
}

export interface PurchaseListResponse {
    data: Purchase[];
    meta: any;
}

export interface PurchaseResponse {
    data: Purchase;
}

export interface TotalPushchasesInPeriodRequest {
    startDate: string;
    endDate: string;
}
export interface TotalPushchasesInPeriodResponse {
    totalPurchasesValue: number;
}

export interface SearchByPeriodRequest {
    startDate?: string | null; // Formato ISO
    endDate?: string | null;   // Formato ISO
}