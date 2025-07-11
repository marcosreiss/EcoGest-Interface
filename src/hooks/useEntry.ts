import type { AxiosError } from 'axios';
import type { FilterParams } from 'src/models/filterParams';
import type {
  Entry,
  EntryPayload,
  EntryResponse,
  EntryListResponse,
  EntryPaginatedParams,
  CustomEntryReceiptInfo,
  EntryRelatoryRequestByPeriod,
} from 'src/models/entry';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createEntryService,
  updateEntryService,
  deleteEntryService,
  getEntryByIdService,
  getEntryReceiptService,
  getEntryPaginatedService,
  getCustomEntryReceiptService,
  searchExpensesByPeriodService,
  getEntryRelatoryByPeriodService,
} from 'src/services/entryService';

// Hook para listar despesas paginadas
export const useGetEntriesPaginated = (params: EntryPaginatedParams) =>
  useQuery<EntryListResponse, AxiosError>({
    queryKey: ['expenses-list', { params }],
    queryFn: () => getEntryPaginatedService(params),
  });

// Hook para criar uma nova despesa
export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<EntryResponse, AxiosError, EntryPayload>({
    mutationFn: (payload) => createEntryService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['expenses-list'],
      });
    },
  });
};

// Hook para atualizar uma despesa
export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<EntryResponse, AxiosError, { id: number; data: EntryPayload }>({
    mutationFn: ({ id, data }) => updateEntryService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['expenses-list'],
      });
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
    },
  });
};

// Hook para deletar uma despesa
export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => deleteEntryService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['expenses-list'],
      });
    },
  });
};

// Hook para buscar uma despesa por ID
export const useGetEntryById = (id: number) =>
  useQuery<Entry, AxiosError>({
    queryKey: ['expense', id],
    queryFn: () => getEntryByIdService(id),
  });

// Hook para obter recibo de despesa
export const useGetExpenseReceipt = (expenseId: number) =>
  useQuery<Blob, AxiosError>({
    queryKey: ['expense-receipt', expenseId],
    queryFn: () => getEntryReceiptService(expenseId),
    enabled: !!expenseId,
  });

export const useGenerateCustomExpenseReceipt = () =>
  useMutation<Blob, AxiosError, CustomEntryReceiptInfo>({
    mutationFn: (info) => getCustomEntryReceiptService(info),
  });

export const useSearchExpensesByPeriod = (payload: FilterParams) =>
  useQuery<Entry[], AxiosError>({
    queryKey: ['expensesByPeriod', payload],
    queryFn: () => searchExpensesByPeriodService(payload.startDate!, payload.endDate!),
    enabled: !!payload?.startDate && !!payload?.endDate,
  });

// Hook para obter relatório de despesas
// export const useGetEntryRelatoryByMonth = () =>
//   useMutation<Blob, AxiosError, EntryRelatoryRequestByMonth>({
//     mutationFn: (params) => getEntryRelatoryByMonthService(params),
//   });

export const useGetEntryRelatoryByPeriod = () =>
  useMutation<Blob, AxiosError, EntryRelatoryRequestByPeriod>({
    mutationFn: (params) => getEntryRelatoryByPeriodService(params),
  });
