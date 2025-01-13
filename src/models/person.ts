export enum PersonType{
    cliente = "cliente",
    fornecedor = "fornecedor"
}

export interface Person {
    personId: number;
    name: string;
    type: PersonType;
    cpfCnpj: string;
    contact: string;
    email: string;
    obs: string;
    address: Address;
}

export interface Address{
    addressId:  number;
    cep: string;
    cidade: string;
    uf: string;
    bairro: string;
    endereco: string;
    numero: string;
    complemento: string;
}

export interface PersonPayload {
    name: string;
    type: PersonType;
    cpfCnpj: string;
    contact: string | null;
    email: string | null;
    obs: string | null;
    cep: string | null;
    cidade: string | null;
    uf: string | null;
    bairro: string | null;
    endereco: string | null;
    numero: string | null;
    complemento: string | null;
}

export interface PersonBasicInfo {
    personId: number;
    name: string;
}

export interface PersonListResponse {
    data: Person[];
    meta: any;
}

export interface PersonResponse {
    data: Person;
}

export interface PersonBasicInfoList {
    data: PersonBasicInfo[];
}