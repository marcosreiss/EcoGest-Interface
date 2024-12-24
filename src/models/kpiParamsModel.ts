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
    Week = "week",
    Month = "month",
    Year = "year"
}

export enum StackBy {
    Supplier = "fornecedor",
    Product = "produtosa"
}