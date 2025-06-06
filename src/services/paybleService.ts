import type { Payble, PaybleList, PayableParams, UpdatePayableStatusParams } from 'src/models/payable';

import api from './api';

export const getPayblesPagedService = async (params: PayableParams): Promise<PaybleList> => {
  console.log(params);
  const response = await api.get<PaybleList>('/payables', { params });
  return response.data;
};

export const getPaybleByIdService = async (id: number): Promise<Payble> => {
  const response = await api.get<Payble>(`/payables/search/by-id?id=${id}`);
  return response.data;
};

export const updatePayableStatusService = async (
  params: UpdatePayableStatusParams
): Promise<number> => {
  const { id, status, date, payedValue } = params;

  const query = new URLSearchParams();
  query.append('id', id.toString());
  query.append('status', status);
  if (date) query.append('date', date);
  if (payedValue !== undefined) query.append('payedValue', payedValue.toString());

  const response = await api.put(`/payables/status?${query.toString()}`);
  return response.status;
};

export const updatePayabledataPagamentoService = async (
  dataPagamento: string,
  payableId: number
): Promise<Payble> => {
  const response = await api.put<Payble>(`/payables?id=${payableId}`, { dataPagamento });
  return response.data;
};

export const deletePaybleService = async (id: number): Promise<void> => {
  await api.delete(`/payables?id=${id}`);
};

export const searchPayblesByPeriodService = async (
  startDate: string,
  endDate: string
): Promise<PaybleList> => {
  try {
    const response = await api.get<PaybleList>(
      `/payables/period?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    console.error('[searchPayblesByPeriodService] Error:', error);
    throw new Error('Error fetching paybles by period.');
  }
};
