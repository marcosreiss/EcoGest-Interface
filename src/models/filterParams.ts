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