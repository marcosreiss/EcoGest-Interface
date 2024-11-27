
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

export interface CreateCustumerPayload{
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
}

export const getCustomersPaginadedService = async(skip:number, take:number): Promise<CustomerListResponse> =>{
    const response = await api.get<CustomerListResponse>("/customers", {params: {skip, take}});
    return response.data;
};