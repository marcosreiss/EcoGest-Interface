export interface KpiParams{
    startDate?: string,
    endDate?: string,
    productId?: number,
    supplierId?: number,
    period?: TimeGranularity,
    stackBy?: StackBy
}

export enum TimeGranularity {
    Day = "day",
    Month = "month",
    Year = "year"
}

export enum StackBy {
    Supplier = "Fornecedor",
    Product = "Produtos"
}