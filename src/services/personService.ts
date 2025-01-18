// src/services/personsService.ts

import type {
    Person,
    PersonPayload,
    PersonResponse,
    PersonListResponse,
    PersonBasicInfoList
} from "src/models/person";

import api from "./api";

/**
 * Obter lista de pessoas com paginação.
 * @param skip Número de registros a pular.
 * @param take Número de registros a obter.
 * @returns Lista paginada de pessoas.
 */
export const getPersonsPagedService = async (skip: number, take: number): Promise<PersonListResponse> => {
    const response = await api.get<PersonListResponse>("/person", { params: { skip, take } });
    return response.data;
};

/**
 * Criar uma nova pessoa.
 * @param payload Dados da pessoa a ser criada.
 * @returns Dados da pessoa criada.
 */
export const createPersonService = async (payload: PersonPayload): Promise<PersonResponse> => {
    const response = await api.post<PersonResponse>("/person", payload);
    return response.data;
};

/**
 * Atualizar uma pessoa existente.
 * @param payload Dados atualizados da pessoa.
 * @param id ID da pessoa a ser atualizada.
 * @returns Dados da pessoa atualizada.
 */
export const updatePersonService = async (payload: Person, id: number): Promise<PersonResponse> => {
    const response = await api.put<PersonResponse>(`/person?id=${id}`, payload);
    return response.data;
};

/**
 * Deletar uma pessoa.
 * @param id ID da pessoa a ser deletada.
 */
export const deletePersonService = async (id: number): Promise<void> => {
    await api.delete(`/person?id=${id}`);
};

/**
 * Buscar uma pessoa por ID.
 * @param id ID da pessoa.
 * @returns Dados da pessoa.
 */
export const getPersonByIdService = async (id: number): Promise<Person> => {
    console.log(id);
    
    const response = await api.get<Person>(`/person/search/by-id?id=${id}`);
    return response.data;
};

/**
 * Buscar pessoas por nome.
 * @param name Nome da pessoa.
 * @returns Lista de pessoas que correspondem ao nome.
 */
export const getPersonByNameService = async (name: string): Promise<Person[]> => {
    const response = await api.get<Person[]>(`/person/search/by-name`, { params: { name } });
    return response.data;
};

/**
 * Obter informações básicas de todas as pessoas.
 * @returns Lista de informações básicas das pessoas.
 */
export const getPersonsBasicInfoService = async (): Promise<PersonBasicInfoList> => {
    const response = await api.get<PersonBasicInfoList>("/person/basic-info");
    return response.data;
};

/**
 * Obter informações básicas de todas os fornecedores.
 * @returns Lista de informações básicas das pessoas.
 */
export const getSuppliersBasicInfoService = async (): Promise<PersonBasicInfoList> => {
    const response = await api.get<PersonBasicInfoList>("/suppliers/basic-info");
    return response.data;
};

/**
 * Obter informações básicas de todas os clientes.
 * @returns Lista de informações básicas das pessoas.
 */
export const getCustomersBasicInfoService = async (): Promise<PersonBasicInfoList> => {
    const response = await api.get<PersonBasicInfoList>("/clients/basic-info");
    return response.data;
};
