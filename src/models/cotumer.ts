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
