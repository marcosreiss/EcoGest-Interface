import type
{
  GetVendas,
  KpiParams,
  GetDespesas,
  SaldoProjetado,
  FluxoCaixaDiario,
  FluxoCaixaMensal,
  DownloadPdfByMonth,
  PaybleRecibleAmount,
  DownloadPdfByPeriod
} from 'src/models/kpiModel'

import api from './api'

export const getFluxoCaixaMensalService = async (year?: number): Promise<FluxoCaixaMensal> => {
  const response = await api.get<FluxoCaixaMensal>("/kpi/monthly-cashflow", {
    params: year ? { year } : undefined,
  });
  return response.data;
};

export const getFluxoCaixaDiarioService = async (
  year: number,
  month: number,
  personId?: number,
  productId?: number
): Promise<FluxoCaixaDiario> => {
  const response = await api.get<FluxoCaixaDiario>("/kpi/daily-cashflow", {
    params: {
      year,
      month,
      ...(personId && { personId }),
      ...(productId && { productId })
    }
  });
  return response.data;
};

export const getPaybleRecibleAmountService = async (): Promise<PaybleRecibleAmount> => {
  const response = await api.get<PaybleRecibleAmount>("/kpi/counts");
  return response.data;
};

export const getSaldoProjetadoService = async (
  params?: KpiParams
): Promise<SaldoProjetado> => {
  const response = await api.get<SaldoProjetado>("/kpi/profit", {
    params: {
      ...(params?.personId && { personId: params.personId }),
      ...(params?.productId && { productId: params.productId }),
      ...(params?.date && { startDate: params.date }),
      ...(params?.period && { period: params.period }),
    },
  });
  return response.data;
};

export const getDespesasService = async (
  params?: KpiParams
): Promise<GetDespesas> => {
  const response = await api.get<GetDespesas>("/kpi/expenses", {
    params: {
      ...(params?.personId && { personId: params.personId }),
      ...(params?.productId && { productId: params.productId }),
      ...(params?.date && { startDate: params.date }),
      ...(params?.period && { period: params.period }),
    },
  });
  return response.data;
};

export const getVendasService = async (
  params?: KpiParams
): Promise<GetVendas> => {
  const response = await api.get<GetVendas>("/kpi/sales", {
    params: {
      ...(params?.personId && { personId: params.personId }),
      ...(params?.productId && { productId: params.productId }),
      ...(params?.date && { startDate: params.date }),
      ...(params?.period && { period: params.period }),
    },
  });
  return response.data;
};

export const getDownloadPdfByMonth = async (params: DownloadPdfByMonth): Promise<Blob> => {
  const response = await api.get<Blob>('/kpi/relatory?', {
    params, 
    responseType: 'blob', 
  });
  return response.data;
};

export const getDownloadPdfByPeriod = async (params: DownloadPdfByPeriod): Promise<Blob> => {
  const response = await api.get<Blob>('/kpi/relatory/period?', {
    params, 
    responseType: 'blob', 
  });
  return response.data;
};