import type { AxiosError } from 'axios';

import { useQuery } from '@tanstack/react-query';

import { getSalesKpiService } from '../services/kpiService';
 
import type { SalesKpiParams, SalesKpiResponse } from '../models/salesKpiModel'; 

export const useGetSalesKpi = (salesParams?: SalesKpiParams) =>
    useQuery<SalesKpiResponse, AxiosError>({
        queryKey: ['salesKpi', salesParams],
        queryFn: () => getSalesKpiService(salesParams),
    });
