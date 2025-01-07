import type { KpiParams } from 'src/models/kpiParamsModel'
import type { SalesKpiResponse } from 'src/models/salesKpiResponse'
import type { ExpensesKpiResponse } from 'src/models/ExpensesKpiRespnse'

import api from './api'


export const getSalesKpiService = async (salesParams?: KpiParams): Promise<SalesKpiResponse> =>{
    console.log(salesParams);
    
    const response = await api.get<SalesKpiResponse>("/kpi/sales", {params: salesParams})

    console.log(response);

    return response.data
}

export const getExpensesKpiService = async (expensesParams?: KpiParams): Promise<ExpensesKpiResponse> => {
    const response = await api.get<ExpensesKpiResponse>("/kpi/expenses", { params: expensesParams });
    return response.data;
};

export const getDownloadPdf = async (date: string): Promise<Blob> => {
    const response = await api.get('/kpi/downloadPDF', {
      params: { date }, // Corrige para passar 'date' como parâmetro
      responseType: 'blob', // Indica que a resposta é um arquivo binário
    });
    return response.data;
  };
  