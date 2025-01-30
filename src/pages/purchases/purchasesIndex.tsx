import type { Purchase } from 'src/models/purchase';

import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeletePurchase, useGetPurchasesPaginated } from 'src/hooks/usePurchase';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';
import { EntityType, type FilterParams } from 'src/models/filterParams';

import TableFooterComponent from 'src/components/table/tableFooterComponent';
import TableHeaderComponent from 'src/components/table/tableHeaderComponent';

import PurchaseTableComponent from './components/purchaseTableComponent';
import FilterTableComponent from '../../components/table/filterTableComponent';

// ----------------------------------------------------------------------

export default function PurchasePage() {
  const [selectedPurchases, setSelectedPurchases] = useState<Purchase[]>([]);

  const rowsPerPage = 25;
  const [page, setPage] = useState(0);
  const [purchaseParams, setPurchaseParams] = useState<FilterParams>({
    skip: 0, // Início padrão
    take: rowsPerPage,
    startDate: null,
    endDate: null,
    id: null,
    personId: null,
    nfe: null,
    order: "desc",
    dataVencimento: null,
    status: null,
  });

  const { data, isLoading } = useGetPurchasesPaginated(purchaseParams);

  const notification = useNotification();
  const deletePurchase = useDeletePurchase();

  // Atualizar `skip` sempre que `page` mudar
  React.useEffect(() => {
    setPurchaseParams((prev) => ({
      ...prev,
      skip: page * rowsPerPage, // Recalcula o ponto de início com base na página
    }));
  }, [page, rowsPerPage]);

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

  const purchases = data?.data ?? [];

  return (
    <>
      <Helmet>
        <title>{`Compras - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <TableHeaderComponent
            title="Compras"
            addButtonName="Cadastrar Compra"
            addButtonPath="/purchases/create"
          />
          <Grid item xs={12}>
            <FilterTableComponent
              handleDelete={handleDeletePurchase}
              selectedRows={selectedPurchases}
              setParams={setPurchaseParams}
              entityType={EntityType.purchase}
            />
            <TableContainer
              component={Paper}
              sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}
            >
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

