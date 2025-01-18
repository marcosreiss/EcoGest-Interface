export interface Supplier {
    supplierId: number;
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
}

export interface SupplierListResponse {
    data: Supplier[];
    meta: any;
}

export interface SupplierResponse {
    data: Supplier;
}

export interface CreateSupplierPayload{
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    personType: string;
    address?: string | null;
    contact?: string | null;
}

export interface SupplierBasicInfo{
    personId: number;
    name: string;
}

export interface SuppliersBasicInfoList{
    data: SupplierBasicInfo[];
}