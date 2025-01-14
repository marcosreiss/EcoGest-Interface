import type { Sale } from "./sale";
import type { Entry } from "./entry";
import type { Purchase } from "./purchase";

export interface Payble {
    paybleId: number;
    receiveId: number;
    purchaseId: number | null;
    entryId: number | null;
    status: string;
    dataVencimento: string;
    dataEmissao: string;
    payedValue: number;
    totalValue: number;
    sale: Sale | null;
    entry: Entry | null;
    purchase: Purchase | null;
}

export interface PaybleList {
    data: Payble[];
}