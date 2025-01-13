import type { Payble, PaybleList } from "src/models/payble";

import api from "./api";

/**
 * Obter lista de pagáveis com paginação.
 * @param skip Número de registros a pular.
 * @param take Número de registros a obter.
 * @returns Lista paginada de pagáveis.
 */
export const getPayblesPagedService = async (skip: number, take: number): Promise<PaybleList> => {
  const response = await api.get<PaybleList>("/payble", { params: { skip, take } });
  return response.data;
};

/**
 * Obter um pagável por ID.
 * @param id ID do pagável.
 * @returns Dados do pagável.
 */
export const getPaybleByIdService = async (id: number): Promise<Payble> => {
  const response = await api.get<Payble>(`/payble/${id}`);
  return response.data;
};

/**
 * Deletar um pagável.
 * @param id ID do pagável a ser deletado.
 */
export const deletePaybleService = async (id: number): Promise<void> => {
  await api.delete(`/payble/${id}`);
};
