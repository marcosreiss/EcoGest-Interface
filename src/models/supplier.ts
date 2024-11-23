export interface Supplier {
    id: number;
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
}

export interface SupplierListResponse {
    data: Supplier[];
}

export interface SupplierResponse {
    data: Supplier;
}

export interface CreateSupplierPayload{
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
}