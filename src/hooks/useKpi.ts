import type { AxiosError } from 'axios';
import type { KpiParams } from 'src/models/kpiModel';
import type { ExpensesKpiResponse } from 'src/models/ExpensesKpiRespnse';

import { useQuery, useMutation } from '@tanstack/react-query';

import { getDownloadPdf, getSalesKpiService, getExpensesKpiService } from '../services/kpiService';

import type { SalesKpiResponse } from '../models/salesKpiResponse';

export const useGetSalesKpi = (salesParams?: KpiParams) =>
    useQuery<SalesKpiResponse, AxiosError>({
        queryKey: ['salesKpi', salesParams],
        queryFn: () => getSalesKpiService(salesParams),
    });

export const useGetExpensesKpi = (expensesParams?: KpiParams) =>
    useQuery<ExpensesKpiResponse, AxiosError>({
        queryKey: ['expensesKpi', expensesParams],
        queryFn: () => getExpensesKpiService(expensesParams),
    });

export const useDownloadPdf = () =>
    useMutation<Blob, AxiosError, string>({
        mutationFn: (date: string) => getDownloadPdf(date),
    });
