import type { Payble, PaybleList } from "src/models/payable";

import api from "./api";

/**
 * Obter lista de pagáveis com paginação.
 * @param skip Número de registros a pular.
 * @param take Número de registros a obter.
 * @returns Lista paginada de pagáveis.
 */
export const getPayblesPagedService = async (
  skip: number,
  take: number,
  startDate?: string,
  endDate?: string,
  personId?: string
): Promise<PaybleList> => {
  const params: Record<string, any> = { skip, take };

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (personId) params.personId = personId;

  const response = await api.get<PaybleList>("/payables", { params });
  return response.data;
};


/**
 * Obter um pagável por ID.
 * @param id ID do pagável.
 * @returns Dados do pagável.
 */
export const getPaybleByIdService = async (id: number): Promise<Payble> => {
  const response = await api.get<Payble>(`/payables/search/by-id?id=${id}`);
  return response.data;
};

/**
 * Atualizar o status de um pagável.
 * @param paybleId ID do pagável.
 * @param paybleStatus Novo status do pagável (aprovado ou cancelado).
 * @returns Status da resposta.
 */
export const updatePaybleStatusService = async (
  paybleId: number,
  paybleStatus: 'approved' | 'canceled'
): Promise<number> => {
  const response = await api.put(`/payables/status?id=${paybleId}`, { paybleStatus });
  return response.status;
};

/**
 * Deletar um pagável.
 * @param id ID do pagável a ser deletado.
 */
export const deletePaybleService = async (id: number): Promise<void> => {
  await api.delete(`/payables/${id}`);
};

/**
 * Buscar pagáveis por período.
 * @param startDate Data inicial do período.
 * @param endDate Data final do período.
 * @returns Lista de pagáveis no período especificado.
 */
export const searchPayblesByPeriodService = async (startDate: string, endDate: string): Promise<PaybleList> => {
  try {
    const response = await api.get<PaybleList>(`/payables/period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error('[searchPayblesByPeriodService] Error:', error);
    throw new Error('Error fetching paybles by period.');
  }
};

