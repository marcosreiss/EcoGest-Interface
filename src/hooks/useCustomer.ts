import type { AxiosError } from "axios";
import type { CustomerListResponse } from "src/services/customerService";

import { useQuery } from "@tanstack/react-query";

import { getAllCustomersPaginaded } from "src/services/customerService";

export const useGetAllCustomersPaginated = (skip: number, take: number) =>
    useQuery<CustomerListResponse, AxiosError>({
      queryKey: ["customers", { skip, take }, () => getAllCustomersPaginaded],
      queryFn: () => getAllCustomersPaginaded(skip, take),
    });
      