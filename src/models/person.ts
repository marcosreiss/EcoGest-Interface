export enum PersonType{
    cliente = "cliente",
    fornecedor = "fornecedor"
}

export interface Person {
    name: string;
    cpfCnpj: string;
    contact: string;
    email: string;
    obs: string;
    cep: string;
    cidade: string;
    uf: string;
    bairro: string;
    endereco: string;
    numero: string;
    complemento: string;
    type: PersonType;
}