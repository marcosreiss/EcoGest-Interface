import type { AxiosError } from "axios";
import type { PersonListResponse, PersonBasicInfoList } from "src/models/person";
import type { Customer, CustomerPayload, CustomerResponse } from "src/models/customers";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomerByNameService,
  getCustomersPagedService,
  getCustomersBasicInfoService,
} from "src/services/customerService";

export const useGetCustomersPaginaded = (skip: number, take: number) =>
  useQuery<PersonListResponse, AxiosError>({
    queryKey: ['customers-list', { skip, take }],
    queryFn: () => getCustomersPagedService(skip, take),
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<CustomerResponse, AxiosError, CustomerPayload>({
    mutationFn: (payload) => createCustomerService(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['customers-list'],
      });
    } 
  });
};

export const useUpdateCustomer = () =>
  useMutation<CustomerResponse, AxiosError, { id: number; data: Customer }>({
    mutationFn: ({ id, data }) => updateCustomerService(data, id),
    onMutate: (variables) => {
      console.log("Atualizando cliente com os dados:", variables);
    },
  });

export const useDeleteCustomer = () => {

  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => deleteCustomerService(id),
    onMutate: (variables) => {
      console.log("Deletando cliente com ID:", variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customers-list'],
      });
    }
  });
}
  

export const useGetCustomerById = (id: number) =>
  useQuery<Customer, AxiosError>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerByIdService(id),
  });

export const useGetCustomerByName = (name: string) =>
  useQuery<Customer[], AxiosError>({
    queryKey: ['customers-by-name', name],
    queryFn: () => getCustomerByNameService(name),
    enabled: name.length >= 3
  });

export const useGetCustomersBasicInfo = () => 
  useQuery<PersonBasicInfoList, AxiosError>({
    queryKey: ['customers-basic-info'],
    queryFn: () => getCustomersBasicInfoService(),
  })
