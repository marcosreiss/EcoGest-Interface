import type { Entry } from "./entry";
import type { Purchase } from "./purchase";

export interface Payble {
    payableId: number;
    receiveId: number;
    purchaseId: number | null;
    entryId: number | null;
    status: string;
    dataVencimento: string;
    dataEmissao: string;
    dataPagamento: string;
    payedValue: number;
    totalValue: number;
    entry: Entry | null;
    purchase: Purchase | null;
}

export interface PaybleList {
    data: Payble[];
    meta: any;
}

export interface PayableParams {
    skip: number;
    take: number;
    startDate: string | null;
    endDate: string | null;
    status: "Pago" | "Atrasado" | "Aberto" | null;
}