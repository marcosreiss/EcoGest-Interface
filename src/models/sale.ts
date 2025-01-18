import type { Person } from "./person";
import type { Product } from "./product";

export interface Sale {
    saleId: number;
    personId:number;
    customer: Person;
    date_time: string;
    description: string;
    discount: number;
    totalPrice: number;
    products: SaleProduct[];
}
export interface SaleProduct {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export interface SaleListResponse {
    data: Sale[];
    meta: any;
}

export interface SaleResponse {
    data: Sale;
}

export interface SalePayload {
    personId: number;
    date_time: string;
    description: string;
    products: SaleProductPayload[];
    discount: number;
}

export interface SaleProductPayload{
    productId: number;
    quantity: number;
}

export interface SearchByPeriodRequest {
    startDate: string | null; 
    endDate: string | null;   
}

export interface CustomSaleReceiptInfo{
    destinatario: string;
    valor: number;
    descricao: string;
}