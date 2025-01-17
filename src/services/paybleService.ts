import type { Payble, PaybleList, PayableParams } from "src/models/payable";

import api from "./api";


export const getPayblesPagedService = async (params: PayableParams): Promise<PaybleList> => {
  const response = await api.get<PaybleList>("/payables", { params });
  return response.data;
};

export const getPaybleByIdService = async (id: number): Promise<Payble> => {
  const response = await api.get<Payble>(`/payables/search/by-id?id=${id}`);
  return response.data;
};

export const updatePaybleStatusService = async (
  paybleId: number,
  paybleStatus: 'approved' | 'canceled'
): Promise<number> => {
  console.log(paybleId, " status: ", paybleStatus);
  
  const response = await api.put(`/payables/status?id=${paybleId}`, { paybleStatus });
  return response.status;
};

export const deletePaybleService = async (id: number): Promise<void> => {
  await api.delete(`/payables/${id}`);
};

export const searchPayblesByPeriodService = async (startDate: string, endDate: string): Promise<PaybleList> => {
  try {
    const response = await api.get<PaybleList>(`/payables/period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error('[searchPayblesByPeriodService] Error:', error);
    throw new Error('Error fetching paybles by period.');
  }
};

