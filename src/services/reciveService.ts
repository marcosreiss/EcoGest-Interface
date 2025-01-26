import type { Receive, ReceiveList, ReceiveParams } from "src/models/receive";

import api from "./api";


export const getRecivesPagedService = async (params: ReceiveParams): Promise<ReceiveList> => {
  console.log(params);
  
  const response = await api.get<ReceiveList>("/receives", { params });
  return response.data;
};

export const getReciveByIdService = async (id: number): Promise<Receive> => {
  const response = await api.get<Receive>(`/receives/search/by-id?id=${id}`);
  return response.data;
};

export const deleteReciveService = async (id: number): Promise<void> => {
  await api.delete(`/receives/${id}`);
};

export const updateReceiveStatusService = async (
  paybleId: number,
): Promise<number> => {
  console.log(paybleId, " status: ");
  
  const response = await api.put(`/receives/status?id=${paybleId}`);
  return response.status;
};

export const updateReceiveDataPagamentoService = async (
  dataPagamento: string,
  receiveId: number
): Promise<Receive> => {
  const response = await api.put<Receive>(`/receives?id=${receiveId}`, {
    dataPagamento,
  });
  return response.data;
};

