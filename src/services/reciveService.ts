import type {
  Receive,
  ReceiveList,
  ReceiveParams,
  UpdateReceiveStatusParams,
} from 'src/models/receive';

import api from './api';

export const getRecivesPagedService = async (params: ReceiveParams): Promise<ReceiveList> => {
  const response = await api.get<ReceiveList>('/receives', { params });
  return response.data;
};

export const getReciveByIdService = async (id: number): Promise<Receive> => {
  const response = await api.get<Receive>(`/receives/search/by-id?id=${id}`);
  return response.data;
};

export const deleteReciveService = async (id: number): Promise<void> => {
  await api.delete(`/receives?id=${id}`);
};

export const updateReceiveStatusService = async (
  params: UpdateReceiveStatusParams
): Promise<number> => {
  const query = new URLSearchParams();

  query.append('id', params.id.toString());
  query.append('status', params.status);
  if (params.date) query.append('date', params.date);
  if (params.payedValue !== undefined) query.append('payedValue', params.payedValue.toString());

  const response = await api.put(`/receives/status?${query.toString()}`);
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
