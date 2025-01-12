import type { Person } from "./person";
import { Product } from "./product";

export enum PurchaseStatus {
    processing = "processing",
    approved = "approved",
    canceled = "canceled"
}
export const purchaseStatusMapping: Record<string, string> = {
    processing: "Processando",
    approved: "Aprovado",
    canceled: "Cancelado",
}

export interface Purchase {
    purchaseId: number;
    supplier: Person;
    products: PurchaseProduct[];
    description?: string | null;
    date_time: string;
    paymentSlip: Blob | null;
    discount: number;
}

export interface CreatePurchasePayload {
    personId: number;
    products: PurchaseProduct[];
    description?: string | null;
    date_time: string;
    paymentSlip: Blob | null;
    discount: number;
}

export interface PurchaseProduct {
    productId: number;
    quantity: number;
    price: number;
    product: Product | null;
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