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
    dataPagamento: string;
}

export interface ReceiveList {
    data: Receive[];
    meta: any;
}

export interface ReceiveParams {
    skip: number;
    take: number;
    startDate: string | null;
    endDate: string | null;
    status: "Pago" | "Atrasado" | "Aberto" | null;
}
