import type { AxiosError } from "axios";
import type { Payble, PaybleList } from "src/models/payble";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deletePaybleService,
  getPaybleByIdService,
  getPayblesPagedService,
  updatePaybleStatusService,
  searchPayblesByPeriodService,
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

/**
 * Hook para buscar pagáveis por período.
 * @param payload Objeto contendo as datas inicial e final do período.
 * @returns Dados dos pagáveis no período especificado.
 */
export const useSearchPayblesByPeriod = (payload: { startDate: string; endDate: string }) =>
  useQuery<PaybleList, AxiosError>({
    queryKey: ['payblesByPeriod', payload],
    queryFn: () => searchPayblesByPeriodService(payload.startDate, payload.endDate),
    enabled: !!payload?.startDate && !!payload?.endDate,
  });
