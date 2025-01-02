import type { Sale, SearchByPeriodRequest } from 'src/models/sale';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteSale, useGetSalesPaged, useSearchSalesByPeriod } from 'src/hooks/useSales';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';

import TableComponent from './components/salesTableComponent';
import SalesTableSearch from './components/salesTableSearch'; // Importando a nova table
import TableHeaderComponent from '../../layouts/components/tableHeaderComponent';
import TableFooterComponent from '../../layouts/components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function SalesIndex() {
    const [selectedSales, setSelectedSales] = useState<Sale[]>([]);
    const rowsPerPage = 5;
    const [page, setPage] = useState(0);

    // Estados para gerenciar os dados
    const { data: pagedData, isLoading: isPagedLoading } = useGetSalesPaged(page * rowsPerPage, rowsPerPage);

    // Estados para filtro por período
    const [searchByPeriodRequest, setSearchByPeriod] = useState<SearchByPeriodRequest>({
        startDate: null,
        endDate: null,
    });

    const { data: filteredData, isLoading: isFilteredLoading } = useSearchSalesByPeriod(searchByPeriodRequest);

    // Define os dados para exibição (filtro ou geral)
    const sales = searchByPeriodRequest.startDate && searchByPeriodRequest.endDate
        ? filteredData?.data ?? []
        : pagedData?.data ?? [];

    // Define o estado de carregamento com base no contexto
    const isLoading = isFilteredLoading || isPagedLoading;

    // Gerenciar exclusão de vendas
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

            <DashboardContent maxWidth="md">
                <Grid container>
                    <TableHeaderComponent title="Vendas" addButtonName="Cadastrar Venda" addButtonPath="/sales/create" />
                    <Grid item xs={12}>
                        <SalesTableSearch
                            handleDelete={handleDeleteSale}
                            selectedRows={selectedSales}
                            setSearchByPeriod={setSearchByPeriod}
                            isSearchDisabled={false}
                            handleSearchChange={() => null} // Não utilizado no novo componente
                        />

                        <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
                            <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                                <TableComponent setSelectedSales={setSelectedSales} sales={sales} isLoading={isLoading} />
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
