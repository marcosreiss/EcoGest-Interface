import type { AxiosError } from "axios";
import type { Customer, CustomerResponse, CustomerListResponse, CreateCustumerPayload } from "src/services/customerService";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomerByNameService,
  getCustomersPaginadedService,
} from "src/services/customerService";

export const useGetCustomersPaginaded = (skip: number, take: number) =>
  useQuery<CustomerListResponse, AxiosError>({
    queryKey: ['customers-list', { skip, take }],
    queryFn: () => getCustomersPaginadedService(skip, take),
  });

// export const useCreateCustomer = () => {
//   const queryClient = useQueryClient();

//   return useMutation<CustomerResponse, AxiosError, CreateCustumerPayload>({
//     mutationFn: (payload) => createCustomerService(payload),
//     onMutate: (variables) => {
//       // console.log("Criando cliente com os dados:", variables);
//     },
//     onSuccess: (response) => {
//       queryClient.setQueryData(["customers-list"], (oldData: any) => {
//         if (!oldData) return { data: [response.data] }; 
//         return {
//           ...oldData,
//           data: [...oldData.data, response.data], 
//         };
//       });
//     },
//   });
// };

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<CustomerResponse, AxiosError, CreateCustumerPayload>({
    mutationFn: (payload) => createCustomerService(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(['customers-list', { skip: 0, take: 100 }], (oldData: any) => {
        if (!oldData) {
          return { data: [response] };
        }
        return {
          ...oldData,
          data: [...oldData.data, response], 
        };
      });
    } // fim do onSuccess
  });
};


export const useUpdateCustomer = () =>
  useMutation<CustomerResponse, AxiosError, { id: number; data: Customer }>({
    mutationFn: ({ id, data }) => updateCustomerService(data, id),
    onMutate: (variables) => {
      console.log("Atualizando cliente com os dados:", variables);
    },
  });

export const useDeleteCustomer = () =>
  useMutation<void, AxiosError, number>({
    mutationFn: (id) => deleteCustomerService(id),
    onMutate: (variables) => {
      console.log("Deletando cliente com ID:", variables);
    },
  });

export const useGetCustomerById = (id: number) =>
  useQuery<CustomerResponse, AxiosError>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerByIdService(id),
  });

export const useGetCustomerByName = (name: string) =>
  useQuery<CustomerListResponse, AxiosError>({
    queryKey: ['customers-by-name', name],
    queryFn: () => getCustomerByNameService(name),
  });
