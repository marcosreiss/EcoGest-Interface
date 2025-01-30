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

import TableSearch from '../../components/table/tableSearch';
import TableComponet from './components/customerTableComponent';
import TableHeaderComponent from '../../components/table/tableHeaderComponent';
import TableFooterComponent from '../../components/table/tableFooterComponent';

// ----------------------------------------------------------------------

export default function CustomersIndex() {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useGetCustomersPaginaded(page * rowsPerPage, rowsPerPage);

  const { data: searchResults, isLoading: isSearching } = useGetCustomerByName(debouncedSearchString);

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

  const customers = (debouncedSearchString.length >= 3 ? searchResults : data?.data) ?? [];

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
                  customers={[]}
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
