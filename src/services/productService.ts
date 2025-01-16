import type {
  Product,
  ProductResponse,
  ProductListResponse,
  CreateProductPayload,
  ProductBasicInfoList,
  TotalProductsInStock
} from "src/models/product";

import api from "./api";

export const getProductsPagedService = async (skip: number, take: number): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>("/products", { params: { skip, take } });
  return response.data;
};

export const createProductService = async (payload: CreateProductPayload): Promise<ProductResponse> => {
  console.log(payload);

  const response = await api.post<ProductResponse>("/products", payload);
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

// Buscar produto por nome
export const getProductByNameService = async (name: string): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>(`/products/search/by-name?name=${name}`);
  return response.data;
};

export const getProductsBasicInfoService = async (): Promise<ProductBasicInfoList> => {
  const response = await api.get<ProductBasicInfoList>("/products/basic-info");
  return response.data;
};

export const getTotalProductsInStock = async (): Promise<TotalProductsInStock> => {
  const response = await api.get<TotalProductsInStock>("/products/totals/in-stock");
  return response.data;
}


