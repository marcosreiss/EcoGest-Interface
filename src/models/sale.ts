import type { Product } from "./product";
import type { Customer } from "./customers";

export interface Sale {
    saleId: number;
    productId: number;
    product: Product;
    customerId: number;
    customer: Customer;
    date_time: string;
    saleStatus: 'processing' | 'approved' | 'canceled';
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

export interface CreateSalePayload {
    productId: number;
    customerId: number;
    date_time: string;
    saleStatus: 'processing' | 'approved' | 'canceled';
    quantity: number;
    totalPrice: number;

}

export interface SearchByPeriodRequest {
    startDate: string | null; 
    endDate: string | null;   
}