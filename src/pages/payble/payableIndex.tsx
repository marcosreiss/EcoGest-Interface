import type { Payble, SearchByPeriodRequest } from 'src/models/payable';

import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid, Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeletePayble, useGetPayblesPaged, useSearchPayblesByPeriod } from 'src/hooks/usePayble';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';

import PaybleTableSearch from './components/payableTableSearch';
import PaybleTableComponent from './components/payableTableComponent';
import TableFooterComponent from '../../layouts/components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function PayableIndex() {
  const [selectedPaybles, setSelectedPaybles] = useState<Payble[]>([]);
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  // Estados para gerenciar os dados paginados
  const { data: pagedData, isLoading: isPagedLoading } = useGetPayblesPaged(
    page * rowsPerPage,
    rowsPerPage
  );

  // Estados para filtro por período
  const [searchByPeriodRequest, setSearchByPeriod] = useState<SearchByPeriodRequest>({
    startDate: null,
    endDate: null,
  });

  const { data: filteredData, isLoading: isFilteredLoading } = useSearchPayblesByPeriod(searchByPeriodRequest);

  // Define os dados para exibição (filtrados ou gerais)
  const paybles =
    searchByPeriodRequest.startDate && searchByPeriodRequest.endDate
      ? filteredData?.data ?? []
      : pagedData?.data ?? [];

  // Define o estado de carregamento com base no contexto
  const isLoading = isFilteredLoading || isPagedLoading;

  // Gerenciar exclusão de pagáveis
  const deletePayble = useDeletePayble();
  const notification = useNotification();

  const handleDeletePayble = () => {
    selectedPaybles.forEach((payble) => {
      deletePayble.mutate(payble.payableId, {
        onSuccess: () => {
          notification.addNotification('Pagável deletado com sucesso', 'success');
          setSelectedPaybles([]);
        },
        onError: () => {
          notification.addNotification('Erro ao deletar pagável, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Contas a pagar - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
              Contas a Pagar
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <PaybleTableSearch
              handleDelete={handleDeletePayble}
              selectedRows={selectedPaybles}
              setSearchByPeriod={setSearchByPeriod}
              isSearchDisabled={false}
              handleSearchChange={() => null} // Não utilizado no componente
            />

            <TableContainer
              component={Paper}
              sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}
            >
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <PaybleTableComponent
                  setSelectedPaybles={setSelectedPaybles}
                  paybles={paybles}
                  isLoading={isLoading}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={
                  searchByPeriodRequest.startDate && searchByPeriodRequest.endDate
                    ? filteredData?.meta?.totalItems || 0 // Se undefined, retorna 0
                    : pagedData?.meta?.totalItems || 0 // Se undefined, retorna 0
                }
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
