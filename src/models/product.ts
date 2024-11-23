export interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface ProductListResponse {
    data: Product[];
}

export interface ProductResponse {
    data: Product;
}

export interface CreateProductPayload{
    name: string;
    quantity: number;
    price: number;
}
