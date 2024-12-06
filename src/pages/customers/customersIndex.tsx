
import type { Customer } from 'src/models/customers';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useGetCustomerByName, useGetCustomersPaginaded } from 'src/hooks/useCustomer';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import TableSearch from './components/tableSearch';
import TableComponet from './components/tableComponent';
import TableHeaderComponent from './components/tableHeaderComponent';
import TableFooterComponent from './components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function Page() {

    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);

    const rowsPerPage = 5; 
    const [page, setPage] = useState(0);


    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data, isLoading } = useGetCustomersPaginaded(page * rowsPerPage, rowsPerPage);
    
    
    const totalItemsRef = React.useRef(0);

    // Define totalItems apenas na primeira chamada
    if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
        totalItemsRef.current = data.meta.totalItems;
    }
    const totalItems = totalItemsRef.current; // Use totalItemsRef.current onde necessário

    const { data: searchResults, isLoading: isSearching } = useGetCustomerByName(debouncedSearchString);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        
        // Limpa o timeout anterior para reiniciar o debounce
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
    
        // Se o valor tiver 3 ou mais caracteres, inicia o debounce
        if (inputValue.length >= 3) {
          debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchString(inputValue); // Atualiza o valor com debounce
          }, 500); // Atraso de 500ms antes de executar a busca
        } else {
          // Se o valor for menor que 3 caracteres, limpa a busca
          setDebouncedSearchString('');
        }
      };

      const customers = debouncedSearchString.length >= 3 ? searchResults : data?.data;
    
    return (
        <>
            <Helmet>
                <title>{`Clientes - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <TableHeaderComponent title='Clientes' addButtonName='Cadastrar Client' addButtonPath='/customers/create' />
                    <Grid item xs={12}>

                        <TableSearch selectedCustomers={selectedCustomers} handleSearchChange={handleSearchChange}  />

                        <TableContainer component={Paper} sx={{height: '65vh', display: 'flex',flexDirection: 'column', }}>

                            <Box component="div" sx={{flex: 1, overflow: 'auto',}}>
                                <TableComponet setSelectedCustomers={setSelectedCustomers} isSearching={isSearching} customers={customers || []} isLoading={isLoading} />
                            </Box>

                            <TableFooterComponent setPage={setPage} page={page} rowsPerPage={rowsPerPage} totalItems={totalItems} />
                        </TableContainer>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
