
import type
{
    Customer,
    CustomerPayload,
    CustomerResponse,
    CustomerListResponse,
    CustomerBasicInfoList
}
from "src/models/customers";

import api from "./api";



export const getCustomersPagedService = async (skip: number, take: number): Promise<CustomerListResponse> => {
    const response = await api.get<CustomerListResponse>("/customers", { params: { skip, take } });

    return response.data;
};

export const createCustomerService = async (payload: CustomerPayload): Promise<CustomerResponse> => {
    // console.log('cadastrando cliente como os dados: ', payload);
    
    const response = await api.post<CustomerResponse>("/customers", payload);
    return response.data;
}

// Atualizar cliente
export const updateCustomerService = async (payload: Customer, id: number): Promise<CustomerResponse> => {
    const response = await api.put<CustomerResponse>(`/customers?id=${id}`, payload);
    return response.data;
};

// Deletar cliente
export const deleteCustomerService = async (id: number): Promise<void> => {
    await api.delete(`/customers/?id=${id}`);
};

// Buscar cliente por ID
export const getCustomerByIdService = async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/search/by-id?id=${id}`);
    return response.data;
};

// Buscar cliente por nome
export const getCustomerByNameService = async (name: string): Promise<Customer[]> => {
    const response = await api.get<Customer[]>(`/customers/search/by-name?name=${name}`);
    return response.data;
};

export const getCustomersBasicInfoService = async (): Promise<CustomerBasicInfoList> =>{
    const response = await api.get<CustomerBasicInfoList>("/customers/basic-info");
    return response.data;
}

