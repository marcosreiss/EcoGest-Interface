import type { AxiosError } from "axios";
import type {
  GetVendas,
  KpiParams,
  GetDespesas,
  SaldoProjetado,
  FluxoCaixaMensal,
  FluxoCaixaDiario,
  DownloadPdfParams,
  PaybleRecibleAmount,
} from "src/models/kpiModel";

import { useQuery, useMutation } from "@tanstack/react-query";

import {
  getDownloadPdf,
  getVendasService,
  getDespesasService,
  getSaldoProjetadoService,
  getFluxoCaixaMensalService,
  getFluxoCaixaDiarioService,
  getPaybleRecibleAmountService,
} from "src/services/kpiService";

// Hook para obter fluxo de caixa mensal
export const useGetFluxoCaixaMensal = (year?: number) =>
  useQuery<FluxoCaixaMensal, AxiosError>({
    queryKey: ["fluxoCaixaMensal", year],
    queryFn: () => getFluxoCaixaMensalService(year),
  });

// Hook para obter fluxo de caixa diário
export const useGetFluxoCaixaDiario = (
  year: number,
  month: number,
  personId?: number,
  productId?: number
) =>
  useQuery<FluxoCaixaDiario, AxiosError>({
    queryKey: ["fluxoCaixaDiario", { year, month, personId, productId }],
    queryFn: () =>
      getFluxoCaixaDiarioService(year, month, personId, productId),
  });

// Hook para obter a contagem de pagáveis e recebíveis
export const useGetPaybleRecibleAmount = () =>
  useQuery<PaybleRecibleAmount, AxiosError>({
    queryKey: ["paybleRecibleAmount"],
    queryFn: getPaybleRecibleAmountService,
  });

// Hook para obter saldo projetado
export const useGetSaldoProjetado = (params?: KpiParams) =>
  useQuery<SaldoProjetado, AxiosError>({
    queryKey: ["saldoProjetado", params],
    queryFn: () => getSaldoProjetadoService(params),
  });

// Hook para obter despesas
export const useGetDespesas = (params?: KpiParams) =>
  useQuery<GetDespesas, AxiosError>({
    queryKey: ["despesas", params],
    queryFn: () => getDespesasService(params),
  });

// Hook para obter vendas
export const useGetVendas = (params?: KpiParams) =>
  useQuery<GetVendas, AxiosError>({
    queryKey: ["vendas", params],
    queryFn: () => getVendasService(params),
  });

// Hook para fazer download de PDF
export const useGetDownloadPdf = () =>
  useMutation<Blob, AxiosError, { params: DownloadPdfParams }>({
    mutationFn: ({params}) => getDownloadPdf(params),
  });
