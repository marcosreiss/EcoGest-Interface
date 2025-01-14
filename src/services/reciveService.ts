import type { Recive, ReciveList } from "src/models/recive";

import api from "./api";


/**
 * Obter lista de recebíveis com paginação.
 * @param skip Número de registros a pular.
 * @param take Número de registros a obter.
 * @returns Lista paginada de recebíveis.
 */
export const getRecivesPagedService = async (skip: number, take: number): Promise<ReciveList> => {
  const response = await api.get<ReciveList>("/recive", { params: { skip, take } });
  return response.data;
};

/**
 * Obter um recebível por ID.
 * @param id ID do recebível.
 * @returns Dados do recebível.
 */
export const getReciveByIdService = async (id: number): Promise<Recive> => {
  const response = await api.get<Recive>(`/recive/${id}`);
  return response.data;
};

/**
 * Deletar um recebível.
 * @param id ID do recebível a ser deletado.
 */
export const deleteReciveService = async (id: number): Promise<void> => {
  await api.delete(`/recive/${id}`);
};
