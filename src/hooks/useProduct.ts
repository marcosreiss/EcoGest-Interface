import type { AxiosError } from "axios";
import type { Product, ProductResponse, ProductListResponse, CreateProductPayload, ProductBasicInfoList } from "src/models/product";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  getProductsPagedService,
  getProductByNameService,
  getProductsBasicInfoService,
} from "src/services/productService";

export const useGetProductsPaged = (skip: number, take: number) =>
  useQuery<ProductListResponse, AxiosError>({
    queryKey: ['products-list', { skip, take }],
    queryFn: () => getProductsPagedService(skip, take),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, AxiosError, CreateProductPayload>({
    mutationFn: (payload) => createProductService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products-list'],
      });
    }
  });
};

export const useUpdateProduct = () =>
  useMutation<ProductResponse, AxiosError, { id: number; data: Product }>({
    mutationFn: ({ id, data }) => updateProductService(data, id),
    onMutate: (variables) => {
      console.log("Atualizando produto com os dados:", variables);
    },
    onSuccess: () => {
      // Invalida a lista caso seja necessário atualizar a tabela de produtos
      // queryClient.invalidateQueries({ queryKey: ['products-list'] });
    }
  });

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => deleteProductService(id),
    onMutate: (variables) => {
      console.log("Deletando produto com ID:", variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products-list'],
      });
    }
  });
};

export const useGetProductById = (id: number) =>
  useQuery<Product, AxiosError>({
    queryKey: ['product', id],
    queryFn: () => getProductByIdService(id),
  });

  export const useGetProductByName = (name: string) =>
    useQuery<Product[], AxiosError>({
      queryKey: ['products-by-name', name],
      queryFn: () => getProductByNameService(name),
      enabled: name.length >= 3,
    });

  export const useGetProductsBasicInfo = () => 
    useQuery<ProductBasicInfoList, AxiosError>({
      queryKey: ['products-basic-info'],
      queryFn: () => getProductsBasicInfoService(),
    });
  