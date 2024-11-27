import api from "./api";

export interface Customer {
  id: number;
  name: string;
  cpf?: string | null;
  cnpj?: string | null;
  address?: string | null;
  contact?: string | null;
  isDeleted: boolean;
}

export interface CustomerResponse {
  data: Customer;
}

export interface CustomerListResponse {
  data: Customer[];
}

export interface CustomerPayload {
  name: string;
  cpf?: string | null;
  cnpj?: string | null;
  address?: string | null;
  contact?: string | null;
  isDeleted: boolean;
}

export const getAllCustomersPaginaded = async (
  skip: number,
  take: number
): Promise<CustomerListResponse> => {
  const response = await api.get<CustomerListResponse>("/customer", {
    params: { skip, take },
  });
  return response.data;
};


export const getCustomerById = async (id: number): Promise<CustomerResponse> => {
  const response = await api.get<CustomerResponse>(`/costumers/${id}`);
  return response.data;
};

export const createCustomer = async (payload: Omit<CustomerPayload, "isDeleted">): Promise<CustomerResponse> => {
  const response = await api.post<CustomerResponse>("/costumers", {
    ...payload,
    isDeleted: false, // Always false for new customers
  });
  return response.data;
};

export const updateCustomer = async (id: number, payload: Partial<CustomerPayload>): Promise<CustomerResponse> => {
  const response = await api.put<CustomerResponse>(`/costumers/${id}`, payload);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/costumers/${id}`);
};
