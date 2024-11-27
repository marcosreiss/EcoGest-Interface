import type { AxiosError } from "axios";
import type { CustomerResponse, CustomerListResponse, CreateCustumerPayload} from "src/services/customerService";

import { useQuery, useMutation } from "@tanstack/react-query";

import { createCustomerService, getCustomersPaginadedService } from "src/services/customerService";

export const useGetCustomersPaginaded = (skip: number, take: number) =>
    useQuery<CustomerListResponse, AxiosError>({
        queryKey: ['customers-list', {skip, take}],
        queryFn: () => getCustomersPaginadedService(skip, take),
    });

export const useCreateCustomer = (payload: CreateCustumerPayload) =>
    useMutation<CustomerResponse, AxiosError, CreateCustumerPayload>({
        mutationFn: () => createCustomerService(payload),
        onMutate: (variables) =>{
            console.log("Iniciando a requisição com os dados:", variables);
        }
    })