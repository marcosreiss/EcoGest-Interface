import type { Product } from "./product";
import type { Supplier } from "./supplier";

export enum PurchaseStatus {
    processing, 
    approved, 
    canceled
}
export const purchaseStatusMapping: Record<string, string> = {
    processing: "pendente",
    approved: "aprovado",
    canceled: "cancelado",
};


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
}

export interface CreatePurchasePayload {
    supplierId: number;
    productId: number;
    description?: string | null;
    date_time: Date;
    status: PurchaseStatus;
    paymentSlip: Blob | null;
    weightAmount: number; // Novo atributo
    price: number; // Novo atributo
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