export interface Receipt {
    id: number;
    saleProductId: number;
    saleCustomerId: number;
}

export interface ReceiptListResponse {
    data: Receipt[];
}

export interface ReceiptResponse {
    data: Receipt;
}
