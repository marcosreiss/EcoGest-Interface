import type { Sale } from "./sale";
import type { Entry } from "./entry";

export interface Payble {
    receiveId: number;
    purchaseId: number | null;
    entryId: number | null;
    status: string;
    dataVencimento: string;
    dataEmissao: string;
    payedValue: number;
    totalValue: number;
    sale: Sale;
    entry: Entry;
}

export interface PaybleList {
    data: Payble[];
}