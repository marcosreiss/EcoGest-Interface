import type { Purchase, SearchByPeriodRequest } from 'src/models/purchase';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeletePurchase, useGetPurchasesPaginated, useSearchPurchasesByPeriod } from 'src/hooks/usePurchase';

import { CONFIG } from 'src/config-global'; 
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext'; 
import TableFooterComponent from 'src/layouts/components/tableFooterComponent';
import TableHeaderComponent from 'src/layouts/components/tableHeaderComponent';
import PurchaseTableSearch from 'src/pages/purchases/components/purchaseTableSearch';

import PurchaseTableComponent from './components/purchaseTableComponent';

// ----------------------------------------------------------------------

export default function PurchasePage() {
  const [selectedPurchases, setSelectedPurchases] = useState<Purchase[]>([]);

  const rowsPerPage = 25; 
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetPurchasesPaginated(page * rowsPerPage, rowsPerPage);

  const notification = useNotification();
  const deletePurchase = useDeletePurchase();

  const handleDeletePurchase = () => {
    selectedPurchases.forEach((purchase) => {
      deletePurchase.mutate(purchase.purchaseId, {
        onSuccess: () => {
          notification.addNotification('Compra deletada com sucesso', 'success');
          setSelectedPurchases([]); // Limpa a seleção após a exclusão
        },
        onError: () => {
          notification.addNotification('Erro ao deletar compra, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  const [searchByPeriodRequest, setSearchByPeriod] = useState<SearchByPeriodRequest>();
  const [payload, setPayload] = useState<SearchByPeriodRequest>({startDate: null, endDate: null});
  const searchByPeriod = useSearchPurchasesByPeriod(payload);
  
  
  useEffect(() => {
    if (searchByPeriodRequest?.startDate && searchByPeriodRequest?.endDate) {
      setPayload(searchByPeriodRequest); 
    }
  }, [searchByPeriodRequest]);
  
  const purchases = searchByPeriod.data ?? data?.data ?? [];

  return (
    <>
      <Helmet>
        <title>{`Compras - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <TableHeaderComponent 
            title='Compras' 
            addButtonName='Cadastrar Compra' 
            addButtonPath='/purchases/create' 
          />
          <Grid item xs={12}>
            <PurchaseTableSearch 
              handleDelete={handleDeletePurchase} 
              handleSearchChange={() => null} 
              isSearchDisabled 
              selectedRows={selectedPurchases}  
              setSearchByPeriod={setSearchByPeriod}
            />
            <TableContainer component={Paper} sx={{height: '65vh', display: 'flex', flexDirection: 'column' }}>
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <PurchaseTableComponent 
                  setSelectedPurchases={setSelectedPurchases} 
                  purchases={purchases} 
                  isLoading={isLoading} 
                />
              </Box>

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
