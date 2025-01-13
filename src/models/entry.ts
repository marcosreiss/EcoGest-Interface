export interface Entry {
    entryId: number;
    type: EntryType;
    subtype: string;
    description?: string | null;
    value?: number;
    date_time: Date;
    createdAt: Date;
}
export enum EntryType {
    ganho = "ganho",
    perda = "perda"
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
    date_time: Date;
}

export interface CustomExpenseReceiptInfo{
    pagoA: string;
    valor: number;
    descricao: string;
}