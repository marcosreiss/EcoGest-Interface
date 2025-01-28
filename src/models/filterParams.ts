export interface FilterParams{
    skip: number;
    take: number;
    nfe: string | null;
    order: "asc" | "desc" | null;
    personId: number | null;
    id: number | null;
    startDate:string | null;
    endDate:string | null;
}