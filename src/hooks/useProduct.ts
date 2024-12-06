import type { AxiosError } from "axios";
import type { Product, ProductResponse, ProductListResponse, CreateProductPayload } from "src/models/product";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  getProductsPaginatedService,
} from "src/services/productService";  // Ajuste o path se necessário

export const useGetProductsPaginated = (skip: number, take: number) =>
  useQuery<ProductListResponse, AxiosError>({
    queryKey: ['products-list', { skip, take }],
    queryFn: () => getProductsPaginatedService(skip, take),
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
