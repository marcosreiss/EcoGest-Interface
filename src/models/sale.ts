export interface Sale {
    saleId: number;
    productId: number;
    customerId: number;
    date_time: string; // Representado como string em formato ISO (ex.: "YYYY-MM-DD")
    saleStatus: 'pending' | 'completed' | 'canceled';
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
    saleStatus: 'pending' | 'completed' | 'canceled';
    quantity: number;
    totalPrice: number;

}