
export enum PersonType {
    Individual = 'individual',
    Corporate = 'corporate'
}

export interface Customer {
    customerId: number;
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
    personType: PersonType; 
    createdAt: Date;
}


export interface CustomerListResponse {
    data: Customer[];
    meta: any;
}

export interface CustomerResponse {
    data: Customer;
}

export interface CustomerPayload {
    name: string;
    cpf?: string | null;
    cnpj?: string | null;
    address?: string | null;
    contact?: string | null;
    personType: PersonType; 
}

export interface CustomerBasicInfo {
    personId: number;
    name: string;
}

export interface CustomerBasicInfoList{
    data: CustomerBasicInfo[];
}
  