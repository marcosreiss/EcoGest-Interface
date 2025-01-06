import type { Customer } from 'src/models/customers';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteCustomer, useGetCustomerByName, useGetCustomersPaginaded } from 'src/hooks/useCustomer';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';

import TableSearch from '../../layouts/components/tableSearch';
import TableComponet from './components/customerTableComponent';
import TableHeaderComponent from '../../layouts/components/tableHeaderComponent';
import TableFooterComponent from '../../layouts/components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function CustomersIndex() {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Busca paginada
  const { data, isLoading } = useGetCustomersPaginaded(page * rowsPerPage, rowsPerPage);

  // Busca por nome (quando string >= 3 caracteres)
  const { data: searchResults, isLoading: isSearching } = useGetCustomerByName(debouncedSearchString);

  // Função para lidar com debounce da busca
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

  const deleteCustomer = useDeleteCustomer();
  const notification = useNotification();

  // Deleta múltiplos clientes selecionados
  const handleDeleteCustomer = () => {
    selectedCustomers.forEach((customer) => {
      deleteCustomer.mutate(customer.customerId, {
        onSuccess: () => {
          notification.addNotification('Clientes deletado com sucesso', 'success');
          setSelectedCustomers([]);
        },
        onError: () => {
          notification.addNotification('Erro ao deletar cliente, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  // Determina qual lista de clientes usar (busca ou dados paginados)
  const customers = (debouncedSearchString.length >= 3 ? searchResults : data?.data) ?? [];

  // Ordena os clientes por createdAt (do mais antigo para o mais recente).
  // Se quiser do mais recente para o mais antigo, inverta a subtração ou use reverse().
  const orderedCustomers = [...customers].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <>
      <Helmet>
        <title>{`Clientes - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          {/* Cabeçalho com título e botão de adicionar */}
          <TableHeaderComponent
            title="Clientes"
            addButtonName="Cadastrar Cliente"
            addButtonPath="/customers/create"
          />

          <Grid item xs={12}>
            {/* Barra de busca e botão de deletar selecionados */}
            <TableSearch
              handleDelete={handleDeleteCustomer}
              selectedRows={selectedCustomers}
              handleSearchChange={handleSearchChange}
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
                <TableComponet
                  setSelectedCustomers={setSelectedCustomers}
                  isSearching={isSearching}
                  customers={orderedCustomers} // <--- usamos a lista ordenada
                  isLoading={isLoading}
                />
              </Box>

              {/* Rodapé com paginação */}
              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={data?.meta.totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
