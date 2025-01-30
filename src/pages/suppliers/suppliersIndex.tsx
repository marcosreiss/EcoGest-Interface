import type { Supplier } from 'src/models/supplier';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteSupplier, useGetSupplierByName, useGetSuppliersPaginated } from 'src/hooks/useSupplier';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';

import TableSearch from '../../components/table/tableSearch';
import SupplierTableComponent from './components/supplierTableComponent';
import TableHeaderComponent from '../../components/table/tableHeaderComponent';
import TableFooterComponent from '../../components/table/tableFooterComponent';

// ----------------------------------------------------------------------

export default function SuppliersIndex() {

    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);

    const rowsPerPage = 25;
    const [page, setPage] = useState(0);


    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data, isLoading } = useGetSuppliersPaginated(page * rowsPerPage, rowsPerPage);

    const { data: searchResults, isLoading: isSearching } = useGetSupplierByName(debouncedSearchString);

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

    const deleteSupplier = useDeleteSupplier();
    const notification = useNotification();

    const handleDeleteSupplier = () => {
        selectedSuppliers.forEach((supplier) => {
            deleteSupplier.mutate(supplier.supplierId, {
                onSuccess: () => {
                    notification.addNotification('Fornecedor deletado com sucesso', 'success');
                    setSelectedSuppliers([]);
                },
                onError: () => {
                    notification.addNotification('Erro ao deletar fornecedor, tente novamente mais tarde', 'error');
                },
            });
        });
    };

    const suppliers = debouncedSearchString.length >= 3 ? searchResults : data?.data;

    return (
        <>
            <Helmet>
                <title>{`Fornecedores - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <TableHeaderComponent title='Fornecedores' addButtonName='Cadastrar Fornecedor' addButtonPath='/suppliers/create' />
                    <Grid item xs={12}>

                        <TableSearch handleDelete={handleDeleteSupplier} selectedRows={selectedSuppliers} handleSearchChange={handleSearchChange} isSearchDisabled={false} />

                        <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column', }}>

                            <Box component="div" sx={{ flex: 1, overflow: 'auto', }}>
                                <SupplierTableComponent setSelectedSuppliers={setSelectedSuppliers} isSearching={isSearching} suppliers={[]} isLoading={isLoading} />
                            </Box>

                            <TableFooterComponent setPage={setPage} page={page} rowsPerPage={rowsPerPage} totalItems={data?.meta.totalItems} />
                        </TableContainer>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
