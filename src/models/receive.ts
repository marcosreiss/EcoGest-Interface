import type { Sale } from "./sale";
import type { Entry } from "./entry";

export interface Receive {
    receiveId: number;
    saleId: number | null;
    entryId: number | null;
    status: string;
    dataVencimento: string;
    dataEmissao: string;
    payedValue: number;
    totalValue: number;
    sale: Sale;
    entry: Entry;
}

export interface ReceiveList {
    data: Receive[];
    meta: any;
}
