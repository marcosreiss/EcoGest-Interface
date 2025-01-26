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
    nfe: string;
    receive: {
        dataVencimento: string;
    }
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
    nfe: string;
    dataVencimento: string;
}

export interface SaleProductPayload{
    productId: number;
    quantity: number;
    price: number;
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