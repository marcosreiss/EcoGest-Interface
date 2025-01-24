export interface Entry {
    entryId: number;
    type: EntryType;
    subtype: string;
    description?: string | null;
    value?: number;
    date_time: string;
    createdAt: string;
}
export enum EntryType {
    ganho = "Ganho",
    perda = "Perda"
}

export interface EntryListResponse {
    data: Entry[];
    meta: any;
}

export interface EntryResponse {
    data: Entry;
}

export interface EntryPayload{
    type: EntryType;
    subtype: string;
    description?: string | null;
    value?: number;
    date_time: string;
}

export interface CustomEntryReceiptInfo{
    destinatario: string;
    valor: number;
    descricao: string;
    tipo: string;
};

export interface EntryPaginatedParams {
    skip: number;
    take: number;
    startDate: string | null;
    endDate: string | null;
    subtype: string | null;
}

export interface EntryRelatoryRequestParams{
    subtype: string;
    year: number;
    month:number;
}