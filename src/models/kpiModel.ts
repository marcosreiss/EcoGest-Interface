// Paremetros

export interface KpiParams {
  // year: number | null;
  // month: number | null;
  personId: number | null;
  productId: number | null;
  // startDate: string | null;
  // endDate: string | null;
  date: string | null;
  period: 'day' | 'month' | 'year' | null;
}

export interface DownloadPdfByMonth {
  month: number;
  year: number;
  personId: number | undefined;
}

export interface DownloadPdfByPeriod {
  startDate: string;
  endDate: string;
  personId: number | undefined;
}

// Responses

export interface FluxoCaixaMensal {
  data: {
    year: number;
    months: Month[];
    totalProjectedReceivables: number;
    totalProjectedPayables: number;
    projectedBalance: number;
    totalPaidReceivables: number;
    totalPaidPayables: number;
    paidBalance: number;
  };
}
export interface Month {
  month: number;
  totalReceivables: number;
  totalReceived: number;
  totalPayables: number;
  totalPaid: number;
}

export interface FluxoCaixaDiario {
  data: {
    year: number;
    month: number;
    days: Day[];

    totalProjectedReceivables: number;
    totalProjectedPayables: number;
    projectedBalance: number;
    totalPaidReceivables: number;
    totalPaidPayables: number;
    paidBalance: number;

    finalBalance: number;
  };
}
export interface Day {
  day: number;
  totalReceivables: number;
  totalReceived: number;
  totalPayables: number;
  totalPaid: number;
  balance: number;
}

export interface PaybleRecibleAmount {
  data: {
    receivables: Receivables;
    payables: Payables;
  };
}
export interface Receivables {
  open: number;
  overdue: number;
}
export interface Payables {
  open: number;
  overdue: number;
}

export interface SaldoProjetado {
  profit: Profit;
}
export interface Profit {
  dateGroup: string;
  profit: number;
  salesTotal: number;
  purchasesTotal: number;
}

export interface GetDespesas {
  purchases: Purchase[];
}
export interface Purchase {
  dateGroup: number;
  total: number;
}

export interface GetVendas {
  sale: Sale[];
}
export interface Sale {
  dateGroup: number;
  total: number;
}
