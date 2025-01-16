import type { AxiosError } from "axios";
import type { Payble, PaybleList, PayableParams } from "src/models/payable";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deletePaybleService,
  getPaybleByIdService,
  getPayblesPagedService,
  updatePaybleStatusService,
} from "src/services/paybleService";

/**
 * Hook para obter uma lista paginada de pagáveis com filtros opcionais.
 */
export const useGetPayblesPaged = (params: PayableParams) =>
  useQuery<PaybleList, AxiosError>({
    queryKey: ["paybles-list", { params }],
    queryFn: () => getPayblesPagedService(params),
  });


/**
 * Hook para obter os detalhes de um pagável pelo ID.
 */
export const useGetPaybleById = (id: number) =>
  useQuery<Payble, AxiosError>({
    queryKey: ["payble", id],
    queryFn: () => getPaybleByIdService(id),
  });

export const useUpdatePaybleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, { id: number; paybleStatus: 'approved' | 'canceled' }>({
    mutationFn: ({ id, paybleStatus }) => updatePaybleStatusService(id, paybleStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paybles-list'] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar o status do pagável:", error);
    },
  });
};

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

