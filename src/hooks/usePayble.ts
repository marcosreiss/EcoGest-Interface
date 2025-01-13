import type { AxiosError } from "axios";
import type { Payble, PaybleList } from "src/models/payble";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deletePaybleService,
  getPaybleByIdService,
  getPayblesPagedService,
} from "src/services/paybleService";

/**
 * Hook para obter uma lista paginada de pagáveis.
 */
export const useGetPayblesPaged = (skip: number, take: number) =>
  useQuery<PaybleList, AxiosError>({
    queryKey: ["paybles-list", { skip, take }],
    queryFn: () => getPayblesPagedService(skip, take),
  });

/**
 * Hook para obter os detalhes de um pagável pelo ID.
 */
export const useGetPaybleById = (id: number) =>
  useQuery<Payble, AxiosError>({
    queryKey: ["payble", id],
    queryFn: () => getPaybleByIdService(id),
  });

/**
 * Hook para deletar um pagável.
 */
export const useDeletePayble = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => deletePaybleService(id),
    onMutate: (variables) => {
      console.log("Deletando pagável com ID:", variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paybles-list"],
      });
    },
  });
};
