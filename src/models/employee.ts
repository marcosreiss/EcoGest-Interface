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
    dataAdmissao: Date;
    dataDemissao?: Date;
    periodoFerias?: string;
    dataDePagamento?: Date;
    status: 'Empregado' | 'Demitido' | 'Férias';
    isDeleted: boolean;
}

export interface EmployeeListResponse {
    employees: Employee[];
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
    dataAdmissao: Date;
    dataDemissao?: Date;
    periodoFerias?: string;
    dataDePagamento?: Date;
    status: 'Empregado' | 'Demitido' | 'Férias';
    isDeleted: boolean;
}