import type { Product } from "./product";
import type { Supplier } from "./supplier";

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
    supplierId: number;
    supplier: Supplier | null;
    productId: number;
    product: Product | null;
    description?: string | null;
    date_time: Date;
    paymentSlip: { data: number[] } | null;
    purchaseStatus: PurchaseStatus;
    weightAmount: number; // Novo atributo
    price: number; // Novo atributo
    totalPrice: number;
}

export interface CreatePurchasePayload {
    personId: number;
    product: PurchaseProduct[];
    description?: string | null;
    date_time: Date;
    paymentSlip: Blob | null;
    discount: number;
}

export interface PurchaseProduct {
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