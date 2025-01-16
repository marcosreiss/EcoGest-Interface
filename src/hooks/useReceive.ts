import type { AxiosError } from "axios";
import type { Receive } from "src/models/receive";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteReciveService,
  getReciveByIdService,
  getRecivesPagedService,
} from "src/services/reciveService";

/**
 * Hook para obter uma lista paginada de recebíveis.
 */
export const useGetRecivesPaged = (
  skip: number,
  take: number,
  startDate?: string,
  endDate?: string,
  status?: "Pago" | "Atrasado" | "Aberto"
) =>
  useQuery<Receive[], AxiosError>({
    queryKey: ["recives-list", { skip, take, startDate, endDate, status }],
    queryFn: () => getRecivesPagedService(skip, take, startDate, endDate, status),
    enabled: !!skip && !!take, 
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
