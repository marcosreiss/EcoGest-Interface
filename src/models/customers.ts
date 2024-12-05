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
}


export interface CustomerListResponse {
    data: Customer[];
    meta: any;
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
    personType: PersonType; 
}

export const customerFieldLabels: Record<string, string> = {
    name: "Nome",
    address: "Endereço",
    contact: "Contato"
  };
  