import type { AxiosError } from "axios";
import type { CustomerListResponse} from "src/services/customerService";

import { useQuery } from "@tanstack/react-query";

import { getCustomersPaginadedService } from "src/services/customerService";

export const useGetCustomersPaginaded = (skip: number, take: number) =>
    useQuery<CustomerListResponse, AxiosError>({
        queryKey: ['customers-list', {skip, take}],
        queryFn: () => getCustomersPaginadedService(skip, take),
    });

