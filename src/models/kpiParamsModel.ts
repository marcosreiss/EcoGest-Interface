export interface KpiParams{
    startDate?: string,
    endDate?: string,
    productId?: number,
    supplierId?: number,
    period?: TimeGranularity,
    stackBy?: StackBy
}
export enum TimeGranularity {
    Day = "Dia",
    // Week = "Semana",
    Month = "Mês",
    Year = "Ano"
}

export enum StackBy {
    Supplier = "Fornecedor",
    Product = "Produtos"
}