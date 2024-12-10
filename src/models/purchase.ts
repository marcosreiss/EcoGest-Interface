import type { Product } from "./product";
import type { Supplier } from "./supplier";

export enum PurchaseStatus {
    pending, 
    approved, 
    canceled
}

export interface Purchase {
    id: number;
    supplierId: number;
    supplier: Supplier | null;
    productId: number;
    product: Product | null;
    description?: string | null;
    purchaseDate: Date;
    paymentSlip: { data: number[] } | null;
    status: PurchaseStatus;
    weightAmount: number; // Novo atributo
    price: number; // Novo atributo
}

export interface CreatePurchasePayload {
    supplierId: number;
    productId: number;
    description?: string | null;
    purchaseDate: Date;
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
    startDate: string; // Formato ISO
    endDate: string;   // Formato ISO
}