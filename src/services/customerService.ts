
import api from "./api";

export interface Customer {
    id: number;
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
}

export interface CustomerListResponse {
    data: Customer[];
}

export interface CustomerResponse {
    data: Customer;
}

export interface CreateCustumerPayload {
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
}

export const getCustomersPaginadedService = async (skip: number, take: number): Promise<CustomerListResponse> => {
    const response = await api.get<CustomerListResponse>("/customers", { params: { skip, take } });
    return response.data;
};

export const createCustomerService = async (payload: CreateCustumerPayload): Promise<CustomerResponse> => {
    const response = await api.post<CustomerResponse>("/customers/", payload);
    return response.data;
}

// Atualizar cliente
export const updateCustomerService = async (payload: Customer, id: number): Promise<CustomerResponse> => {
    const response = await api.put<CustomerResponse>(`/customers/${id}`, payload);
    return response.data;
};

// Deletar cliente
export const deleteCustomerService = async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
};

// Buscar cliente por ID
export const getCustomerByIdService = async (id: number): Promise<CustomerResponse> => {
    const response = await api.get<CustomerResponse>(`/customers/${id}`);
    return response.data;
};

// Buscar cliente por nome
export const getCustomerByNameService = async (name: string): Promise<CustomerListResponse> => {
  const response = await api.get<CustomerListResponse>("/customers", {
    params: { name },
  });
  return response.data;
};


