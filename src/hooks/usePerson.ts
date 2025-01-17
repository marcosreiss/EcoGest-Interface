import type { AxiosError } from "axios";
import type { 
  Person, 
  PersonPayload, 
  PersonResponse, 
  PersonListResponse, 
  PersonBasicInfoList 
} from "src/models/person";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPersonService,
  updatePersonService,
  deletePersonService,
  getPersonByIdService,
  getPersonByNameService,
  getPersonsPagedService,
  getPersonsBasicInfoService,
} from "src/services/personService";

/**
 * Hook para obter uma lista paginada de pessoas.
 */
export const useGetPersonsPaged = (skip: number, take: number) =>
  useQuery<PersonListResponse, AxiosError>({
    queryKey: ['persons-list', { skip, take }],
    queryFn: () => getPersonsPagedService(skip, take),
  });

/**
 * Hook para criar uma nova pessoa.
 */
export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation<PersonResponse, AxiosError, PersonPayload>({
    mutationFn: (payload) => createPersonService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['persons-list'],
      });
    },
  });
};

/**
 * Hook para atualizar uma pessoa existente.
 */
export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation<PersonResponse, AxiosError, { id: number; data: Person }>({
    mutationFn: ({ id, data }) => updatePersonService(data, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['persons-list']});
      queryClient.invalidateQueries({ queryKey: ['person', variables.id]});
    },
  });
};


/**
 * Hook para deletar uma pessoa.
 */
export const useDeletePerson = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>({
    mutationFn: (id) => deletePersonService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['persons-list'],
      });
    },
  });
};

/**
 * Hook para obter os detalhes de uma pessoa pelo ID.
 */
export const useGetPersonById = (id: number) =>
  useQuery<Person, AxiosError>({
    queryKey: ['person', id],
    queryFn: () => getPersonByIdService(id),
  });

/**
 * Hook para buscar pessoas pelo nome.
 */
export const useGetPersonByName = (name: string) =>
  useQuery<Person[], AxiosError>({
    queryKey: ['persons-by-name', name],
    queryFn: () => getPersonByNameService(name),
    enabled: name.length >= 3, // Habilita a query apenas se o nome tiver pelo menos 3 caracteres
  });

/**
 * Hook para obter informações básicas de todas as pessoas.
 */
export const useGetPersonsBasicInfo = () =>
  useQuery<PersonBasicInfoList, AxiosError>({
    queryKey: ['persons-basic-info'],
    queryFn: () => getPersonsBasicInfoService(),
  });
