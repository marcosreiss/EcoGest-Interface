import type { AxiosError } from "axios";
import type { Payble, PaybleList, PayableParams } from "src/models/payable";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deletePaybleService,
  getPaybleByIdService,
  getPayblesPagedService,
  updatePaybleStatusService,
  updatePayabledataPagamentoService,
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

  return useMutation<number, AxiosError, { id: number}>({
    mutationFn: ({ id }) => updatePaybleStatusService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paybles-list'] });
      queryClient.invalidateQueries({ queryKey: ["payble"] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar o status do pagável:", error);
    },
  });
};

export const useUpdateDataPagamentoPayable = () => {
  const queryClient = useQueryClient();

  return useMutation< Payble, AxiosError, { dataPagamento: string; payableId: number }>({
    mutationFn: ({ dataPagamento, payableId }) =>
      updatePayabledataPagamentoService(dataPagamento, payableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paybles-list"] });
      queryClient.invalidateQueries({ queryKey: ["payble"] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar a data de pagamento da conta a pagar:", error);
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paybles-list"],
      });
    },
  });
};

