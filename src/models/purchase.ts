export interface Purchase {
    id: number;
    supplierId: number; 
    productId: number; 
    description?: string | null; 
    purchaseDate: string; 
    status: 'pending' | 'approved' | 'canceled';
}

export interface PurchaseListResponse {
    data: Purchase[];
}

export interface PurchaseResponse {
    data: Purchase;
}
