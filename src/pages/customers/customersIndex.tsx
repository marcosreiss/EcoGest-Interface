
import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useGetCustomersPaginaded } from 'src/hooks/useCustomer';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { customerFieldLabels } from 'src/models/customers';

import TableSearch from './components/tableSearch';
import TableComponet from './components/tableComponent';
import TableHeaderComponent from './components/tableHeaderComponent';
import TableFooterComponent from './components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function Page() {

    const rowsPerPage = 5; 
    const [page, setPage] = useState(0);

    const { data, isLoading } = useGetCustomersPaginaded(page * rowsPerPage, rowsPerPage);
    const customers = data?.data;
    const filteredCustomers = customers?.map(({ name, contact }) => ({ name, contact })) || [];
    
    
    const totalItemsRef = React.useRef(0);
    // Define totalItems apenas na primeira chamada
    if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
        totalItemsRef.current = data.meta.totalItems;
    }
    const totalItems = totalItemsRef.current; // Use totalItemsRef.current onde necessário
    
    return (
        <>
            <Helmet>
                <title>{`Clientes - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <TableHeaderComponent title='Clientes' addButtonName='Cadastrar Client' addButtonPath='/customers/create' />
                    <Grid item xs={12}>
                        <TableSearch selectedCount={0} />
                        <TableContainer
                            component={Paper}
                            sx={{
                                height: '65vh', // Altura máxima total
                                display: 'flex',
                                flexDirection: 'column', // Organiza a tabela e o footer em colunas
                            }}
                        >
                            <Box
                                component="div"
                                sx={{
                                    flex: 1, // Faz a tabela ocupar o espaço disponível
                                    overflow: 'auto', // Permite scroll apenas no conteúdo da tabela
                                }}
                            >
                                <TableComponet tableName='customers' data={filteredCustomers || []} fieldLabels={customerFieldLabels} isLoading={isLoading} />
                            </Box>
                            <TableFooterComponent setPage={setPage} page={page} rowsPerPage={rowsPerPage} totalItems={totalItems} />
                        </TableContainer>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
