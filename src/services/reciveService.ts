import type { Receive, ReceiveList, ReceiveParams } from "src/models/receive";

import api from "./api";


/**
 * Obter lista de recebíveis com paginação.
 * @param skip Número de registros a pular.
 * @param take Número de registros a obter.
 * @returns Lista paginada de recebíveis.
 */
export const getRecivesPagedService = async (params: ReceiveParams): Promise<ReceiveList> => {
  console.log(params);
  
  const response = await api.get<ReceiveList>("/receives", { params });
  return response.data;
};


/**
 * Obter um recebível por ID.
 * @param id ID do recebível.
 * @returns Dados do recebível.
 */
export const getReciveByIdService = async (id: number): Promise<Receive> => {
  const response = await api.get<Receive>(`/receives/search/by-id?id=${id}`);
  return response.data;
};

/**
 * Deletar um recebível.
 * @param id ID do recebível a ser deletado.
 */
export const deleteReciveService = async (id: number): Promise<void> => {
  await api.delete(`/receives/${id}`);
};
