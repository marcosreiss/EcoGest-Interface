import type { AxiosError } from "axios";
import type { Receive, ReceiveList, ReceiveParams } from "src/models/receive";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteReciveService,
  getReciveByIdService,
  getRecivesPagedService,
  updateReceiveStatusService,
  updateReceiveDataPagamentoService,
} from "src/services/reciveService";

/** 
 * Hook para obter uma lista paginada de recebíveis.
 */
export const useGetRecivesPaged = (params: ReceiveParams) =>
  useQuery<ReceiveList, AxiosError>({
    queryKey: ["recives-list", { params }],
    queryFn: () => getRecivesPagedService(params),
  });


/**
 * Hook para obter os detalhes de um recebível pelo ID.
 */
export const useGetReceiveById = (id: number) =>
  useQuery<Receive, AxiosError>({
    queryKey: ["recive", id],
    queryFn: () => getReciveByIdService(id),
  });

/**
 * Hook para deletar um recebível.
 */
export const useDeleteRecive = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => deleteReciveService(id),
    onMutate: (variables) => {
      console.log("Deletando recebível com ID:", variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["recives-list"],});
    },
  });
};

export const useUpdateReceiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<number, AxiosError, { id: number }>({
    mutationFn: ({ id }) => updateReceiveStatusService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recives-list'] });
      queryClient.invalidateQueries({ queryKey: ['recive'] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar o status da conta a receber:", error);
    },
  });
};

export const useUpdateDataPagamentoReceive = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Receive,
    AxiosError,
    { dataPagamento: string; receiveId: number }
  >({
    mutationFn: ({ dataPagamento, receiveId }) =>
      updateReceiveDataPagamentoService(dataPagamento, receiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recives-list"] });
      queryClient.invalidateQueries({ queryKey: ['recive'] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar a data de pagamento do recebível:", error);
    },
  });
};

