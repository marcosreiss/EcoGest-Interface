export interface Sale {
    id: number;
    productId: number; 
    customerId: number; 
    saleDate: string; // Representado como string em formato ISO (ex.: "YYYY-MM-DD")
    status: 'pending' | 'completed' | 'canceled';
}

export interface SaleListResponse {
    data: Sale[];
}

export interface SaleResponse {
    data: Sale;
}

export interface CreateSalePayload{
    productId: number; 
    customerId: number; 
    saleDate: string; 
    status: 'pending' | 'completed' | 'canceled';
}