export interface Product {
    productId: number;
    name: string;
    weightAmount: number;
    price: number;
}

export interface ProductListResponse {
    data: Product[];
    meta: any;
}

export interface ProductResponse {
    data: Product;
}

export interface CreateProductPayload{
    name: string;
    weightAmount: number;
    price: number;
}

export interface ProductBasicInfo{
    productId: number;
    name: string;
    weightAmount: number;
    price: number;
}

export interface ProductBasicInfoList{
    data: ProductBasicInfo[];
}

export interface TotalProductsInStock{
    totalProductsInStock: StrockProduct[];
}

export interface StrockProduct {
    name: string;
    totalWeight: number;
}
