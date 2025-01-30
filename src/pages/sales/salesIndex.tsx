import type { Sale } from 'src/models/sale';

import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteSale, useGetSalesPaged } from 'src/hooks/useSales';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';
import { EntityType, type FilterParams } from 'src/models/filterParams';

import TableComponent from './components/salesTableComponent'; // Importando a nova table

import SaleTableHeaderComponent from './components/salesTableHeaderComponent';
import FilterTableComponent from '../../components/table/filterTableComponent';
import TableFooterComponent from '../../components/table/tableFooterComponent';

// ----------------------------------------------------------------------

export default function SalesIndex() {
    const [selectedSales, setSelectedSales] = useState<Sale[]>([]);
    const rowsPerPage = 25;
    const [page, setPage] = useState(0);
        // Estados para filtro por período
        const [salesParams, setSalesParams] = useState<FilterParams>({
            skip: page * rowsPerPage,
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

    // Estados para gerenciar os dados
    const { data, isLoading } = useGetSalesPaged(salesParams);

    const sales =  data?.data ?? [];

    const deleteSale = useDeleteSale();
    const notification = useNotification();

    const handleDeleteSale = () => {
        selectedSales.forEach((sale) => {
            deleteSale.mutate(sale.saleId, {
                onSuccess: () => {
                    notification.addNotification('Venda deletada com sucesso', 'success');
                    setSelectedSales([]);
                },
                onError: () => {
                    notification.addNotification('Erro ao deletar venda, tente novamente mais tarde', 'error');
                },
            });
        });
    };

    return (
        <>
            <Helmet>
                <title>{`Vendas - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="lg">
                <Grid container>
                    <SaleTableHeaderComponent title="Vendas" addButtonName="Cadastrar Venda" addButtonPath="/sales/create" />
                    <Grid item xs={12}>
                        <FilterTableComponent
                            handleDelete={handleDeleteSale}
                            selectedRows={selectedSales}
                            setParams={setSalesParams}
                            entityType={EntityType.sale}
                        />

                        <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
                            <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                                <TableComponent
                                    setSelectedSales={setSelectedSales}
                                    sales={sales} 
                                    isLoading={isLoading}
                                />
                            </Box>

                            <TableFooterComponent
                                setPage={setPage}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                totalItems={data?.meta?.totalItems || 0}
                            />
                        </TableContainer>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
