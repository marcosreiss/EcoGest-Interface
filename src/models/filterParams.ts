
// Parametros da requisição para filtras os dados da tabela
export interface FilterParams{
    skip: number;
    take: number;
    nfe: string | null;
    order: "asc" | "desc" | null;
    personId: number | null;
    id: number | null; // purchase, sale, receive, payable
    startDate:string | null;
    endDate:string | null;
    dataVencimento: string | null;
    status: "Pago" | "Atrasado" | "Aberto" | null;
}

// tipo da entidade no qual o componente de filtro está sendo usado
export enum EntityType {
    purchase,
    sale,
    payable,
    receive
}

// opções de filtro selecionadas pelo usuário
export enum FilterOptions {
    period,
    supplier,
    customer,
    nfe,
    purchase,
    sale,
    payable,
    receive,
    status,
    dataVencimento,
}