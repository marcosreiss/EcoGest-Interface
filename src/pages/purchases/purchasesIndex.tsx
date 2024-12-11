import type { Purchase } from 'src/models/purchase';

import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useGetPurchasesPaginated } from 'src/hooks/usePurchase';

import { CONFIG } from 'src/config-global'; 
import { DashboardContent } from 'src/layouts/dashboard';
import TableSearch from 'src/layouts/components/tableSearch'; 
import { useNotification } from 'src/context/NotificationContext';
import TableFooterComponent from 'src/layouts/components/tableFooterComponent';
import TableHeaderComponent from 'src/layouts/components/tableHeaderComponent';

import PurchaseTableComponent from './components/purchaseTableComponent';

// ----------------------------------------------------------------------

export default function PurchasePage() {
  const [selectedPurchases, setSelectedPurchases] = useState<Purchase[]>([]);

  const rowsPerPage = 5; 
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetPurchasesPaginated(page * rowsPerPage, rowsPerPage);

  const totalItemsRef = React.useRef(0);

  // Define totalItems apenas na primeira chamada
  if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
    totalItemsRef.current = data.meta.totalItems;
  }
  const totalItems = totalItemsRef.current; // Use totalItemsRef.current onde necessário

  const purchases = data?.data || [];

  const notification = useNotification();

  const handleDeletePurchase = () => {
    // Handle deletion logic here if required
    notification.addNotification('Excluir compra não está implementado.', 'info');
  };

  return (
    <>
      <Helmet>
        <title>{`Compras - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <TableHeaderComponent 
            title='Compras' 
            addButtonName='Cadastrar Compra' 
            addButtonPath='/purchases/create' 
          />
          <Grid item xs={12}>
            <TableSearch 
              handleDelete={handleDeletePurchase} 
              handleSearchChange={() => null} 
              isSearchDisabled 
              selectedRows={selectedPurchases}  
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
                totalItems={totalItems} 
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
