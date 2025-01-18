export interface Employee {
    employeeId: number;
    registroNumero: string;
    nome: string;
    rg: string;
    cpf: string;
    contato: string;
    funcao: string;
    salario: number;
    dataAdmissao: Date;
    dataDemissao?: Date | null;
    periodoFerias?: string;
    address: {
        cep: string;
        cidade: string;
        uf: string;
        bairro: string;
        endereco: string;
        numero: number;
        complemento: string;
    }

}

export interface EmployeeListResponse {
    data: Employee[];
    meta: any;
}

export interface EmployeeResponse {
    data: Employee;
}

export interface EmployeePayload {
    registroNumero: string;
    nome: string;
    rg: string;
    cpf: string;
    contato: string;
    funcao: string;
    salario: number;
    dataAdmissao: Date;
    dataDemissao?: Date | null;
    periodoFerias?: string;

    cep: string;
    cidade: string;
    uf: string;
    bairro: string;
    endereco: string;
    numero: number;
    complemento: string;
}