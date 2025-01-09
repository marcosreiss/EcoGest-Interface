export interface Employee {
    employeeId: number;
    registroNumero: string;
    nome: string;
    rg: string;
    cpf: string;
    endereco: string;
    contato: string;
    funcao: string;
    salario: number;
    dataAdmissao: Date | null;
    dataDemissao?: Date | null;
    periodoFerias?: string;
    dataDePagamento?: number;
    status: 'Empregado' | 'Demitido' | 'Férias';
    isDeleted: boolean;
}

export interface EmployeeListResponse {
    data: Employee[];
    meta: any;
}

export interface EmployeeResponse {
    data: Employee;
}

export interface EmployeePayload{
    registroNumero: string;
    nome: string;
    rg: string;
    cpf: string;
    endereco: string;
    contato: string;
    funcao: string;
    salario: number;
    dataAdmissao: Date | null;
    dataDemissao?: Date;
    periodoFerias?: string;
    dataDePagamento?: number;
    status: 'Empregado' | 'Demitido' | 'Férias';
    isDeleted: boolean;
}