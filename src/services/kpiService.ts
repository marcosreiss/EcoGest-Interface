import type { SalesKpiParams, SalesKpiResponse } from 'src/models/salesKpiModel'

import api from './api'


export const getSalesKpiService = async (salesParams?: SalesKpiParams): Promise<SalesKpiResponse> =>{
    const response = await api.get<SalesKpiResponse>("/kpi/sales", {params: salesParams})
    console.log(response.data);
    
    return response.data
}