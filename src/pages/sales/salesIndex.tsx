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

import TableComponent from './components/salesTableComponent';
import TableSearch from '../../layouts/components/tableSearch';
import TableHeaderComponent from '../../layouts/components/tableHeaderComponent';
import TableFooterComponent from '../../layouts/components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function SalesIndex() {
    const [selectedSales, setSelectedSales] = useState<Sale[]>([]);

    const rowsPerPage = 5;
    const [page, setPage] = useState(0);


    const { data, isLoading } = useGetSalesPaged(page * rowsPerPage, rowsPerPage);

    const totalItemsRef = React.useRef(0);

    // Define totalItems apenas na primeira chamada
    if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
        totalItemsRef.current = data.meta.totalItems;
    }
    const totalItems = totalItemsRef.current;


    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const inputValue = event.target.value;

    //     // Limpa o timeout anterior para reiniciar o debounce
    //     if (debounceTimeoutRef.current) {
    //         clearTimeout(debounceTimeoutRef.current);
    //     }

    //     // Se o valor tiver 3 ou mais caracteres, inicia o debounce
    //     if (inputValue.length >= 3) {
    //         debounceTimeoutRef.current = setTimeout(() => {
    //             setDebouncedSearchString(inputValue); // Atualiza o valor com debounce
    //         }, 500); // Atraso de 500ms antes de executar a busca
    //     } else {
    //         // Se o valor for menor que 3 caracteres, limpa a busca
    //         setDebouncedSearchString('');
    //     }
    // };

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

    const sales =  data?.data;

    return (
        <>
            <Helmet>
                <title>{`Vendas - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <TableHeaderComponent title="Vendas" addButtonName="Cadastrar Venda" addButtonPath="/sales/create" />
                    <Grid item xs={12}>
                        <TableSearch
                            handleDelete={handleDeleteSale}
                            selectedRows={selectedSales}
                            handleSearchChange={() => null}
                            isSearchDisabled
                        />

                        <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
                            <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                                <TableComponent
                                    setSelectedSales={setSelectedSales}
                                    sales={sales || []}
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
