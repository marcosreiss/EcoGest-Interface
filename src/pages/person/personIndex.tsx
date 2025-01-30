// src/pages/PersonsIndex.tsx

import type { Person } from 'src/models/person';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid, Alert } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useGetCustomersPaginaded } from 'src/hooks/useCustomer';
import { useGetSuppliersPaginated } from 'src/hooks/useSupplier';
import { useDeletePerson, useGetPersonByName, useGetPersonsPaged } from 'src/hooks/usePerson';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';

import TableComponent from './components/personTableComponent';
import PersonTableSearch from './components/personTableSearch';
import TableHeaderComponent from '../../components/table/tableHeaderComponent';
import TableFooterComponent from '../../components/table/tableFooterComponent';

// ----------------------------------------------------------------------

export default function PersonsIndex() {
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);

  const rowsPerPage = 25;
  const [page, setPage] = useState(0);

  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estado para controlar o tipo de filtro: 'all', 'customer', 'supplier'
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all');

  // Hooks para buscar todas as pessoas, clientes e fornecedores
  const {
    data: personsData,
    isLoading: isLoadingPersons,
    isError: isErrorPersons,
    error: errorPersons,
  } = useGetPersonsPaged(page * rowsPerPage, rowsPerPage);

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isError: isErrorCustomers,
    error: errorCustomers,
  } = useGetCustomersPaginaded(page * rowsPerPage, rowsPerPage);

  const {
    data: suppliersData,
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
    error: errorSuppliers,
  } = useGetSuppliersPaginated(page * rowsPerPage, rowsPerPage);

  const { data: searchResults, isLoading: isSearching } = useGetPersonByName(debouncedSearchString);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (inputValue.length >= 3) {
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchString(inputValue);
      }, 500);
    } else {
      setDebouncedSearchString('');
    }
  };

  const deletePerson = useDeletePerson();
  const notification = useNotification();

  const handleDeletePerson = () => {
    selectedPersons.forEach((person) => {
      deletePerson.mutate(person.personId, {
        onSuccess: () => {
          notification.addNotification('Pessoa deletada com sucesso', 'success');
          setSelectedPersons([]);
        },
        onError: () => {
          notification.addNotification('Erro ao deletar pessoa, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  // Handler para mudar o tipo de filtro
  const handleFilterChange = (newFilter: 'all' | 'customer' | 'supplier') => {
    setFilterType(newFilter);
    setPage(0); // Resetar a página ao mudar o filtro
    setSelectedPersons([]); // Resetar as seleções ao mudar o filtro
  };

  // Determinar quais dados exibir com base no tipo de filtro e na busca
  let persons: Person[] = [];

  if (filterType === 'all') {
    persons = debouncedSearchString.length >= 3 ? searchResults ?? [] : personsData?.data ?? [];
  } else if (filterType === 'customer') {
    persons = debouncedSearchString.length >= 3 ? searchResults ?? [] : customersData?.data ?? [];
  } else if (filterType === 'supplier') {
    persons = debouncedSearchString.length >= 3 ? searchResults ?? [] : suppliersData?.data ?? [];
  }

  // Determinar o total de itens para paginação
  let totalItems: number = 0;

  if (filterType === 'all') {
    totalItems = personsData?.meta.totalItems ?? 0;
  } else if (filterType === 'customer') {
    totalItems = customersData?.meta.totalItems ?? 0;
  } else if (filterType === 'supplier') {
    totalItems = suppliersData?.meta.totalItems ?? 0;
  }

  // Determinar estados de carregamento e erro
  const isLoading =
    isLoadingPersons ||
    isLoadingCustomers ||
    isLoadingSuppliers ||
    isSearching;

  const isError =
    isErrorPersons ||
    isErrorCustomers ||
    isErrorSuppliers;

  const errorMessage =
    isErrorPersons && errorPersons instanceof Error
      ? `Erro ao carregar pessoas: ${errorPersons.message}`
      : isErrorCustomers && errorCustomers instanceof Error
        ? `Erro ao carregar clientes: ${errorCustomers.message}`
        : isErrorSuppliers && errorSuppliers instanceof Error
          ? `Erro ao carregar fornecedores: ${errorSuppliers.message}`
          : 'Erro desconhecido ao carregar os dados.';

  return (
    <>
      <Helmet>
        <title>{`Pessoas - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          {/* Cabeçalho com título e botão de adicionar */}
          <TableHeaderComponent
            title="Pessoas"
            addButtonName="Cadastrar Pessoa"
            addButtonPath="/person/create"
          />

          <Grid item xs={12}>
            {/* Barra de busca, filtro e botão de deletar selecionados */}
            <PersonTableSearch
              handleDelete={handleDeletePerson}
              selectedRows={selectedPersons}
              handleSearchChange={handleSearchChange}
              handleFilterChange={handleFilterChange} // Passando o handler do filtro
              currentFilter={filterType} // Passando o filtro atual para o componente de busca
              isSearchDisabled={false}
            />

            <TableContainer
              component={Paper}
              sx={{
                height: '65vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Área de exibição dos itens da tabela */}
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <TableComponent
                  setSelectedPersons={setSelectedPersons}
                  isSearching={isSearching}
                  persons={persons}
                  isLoading={isLoading}
                />
              </Box>

              {/* Rodapé com paginação */}
              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>

      {/* Mensagem de Erro */}
      {isError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{errorMessage}</Alert>
        </Box>
      )}
    </>
  );
}
