import type { 
    Product, 
    ProductResponse, 
    ProductListResponse, 
    CreateProductPayload 
  } from "src/models/product"; 
  
  import api from "./api";
  
  export const getProductsPaginatedService = async (skip: number, take: number): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>("/products", { params: { skip, take } });
    return response.data;
  };
  
  export const createProductService = async (payload: CreateProductPayload): Promise<ProductResponse> => {
    const response = await api.post<ProductResponse>("/products/create", payload);
    return response.data;
  };
  
  export const updateProductService = async (product: Product, id: number): Promise<ProductResponse> => {
    const response = await api.put<ProductResponse>(`/products?id=${id}`, product);
    return response.data;
  };
  
  export const deleteProductService = async (id: number): Promise<void> => {
    await api.delete(`/products?id=${id}`);
  };
  
  export const getProductByIdService = async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/search/by-id?id=${id}`);
    return response.data;
  };
  