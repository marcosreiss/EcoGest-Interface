import type { KpiParams } from 'src/models/kpiParamsModel'
import type { SalesKpiResponse } from 'src/models/salesKpiResponse'
import type { ExpensesKpiResponse } from 'src/models/ExpensesKpiRespnse'

import api from './api'


export const getSalesKpiService = async (salesParams?: KpiParams): Promise<SalesKpiResponse> =>{
    const response = await api.get<SalesKpiResponse>("/kpi/sales", {params: salesParams})
    return response.data
}

export const getExpensesKpiService = async (expensesParams?: KpiParams): Promise<ExpensesKpiResponse> => {
    const response = await api.get<ExpensesKpiResponse>("/kpi/expenses", { params: expensesParams });
    return response.data;
};