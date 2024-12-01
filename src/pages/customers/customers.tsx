import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { LoadingButton } from '@mui/lab';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, Button, Checkbox, Typography } from '@mui/material';

import { useGetCustomersPaginaded } from 'src/hooks/useCustomer';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Page() {
    const navigate = useNavigate();
    
    const rowsPerPage = 5; // Número fixo de linhas por página
    const [page, setPage] = useState(0); // Página atual

    // Chama o hook passando `skip` (page * rowsPerPage) e `rowsPerPage`
    const { data, isLoading } = useGetCustomersPaginaded(page * rowsPerPage, rowsPerPage);
    
    const customers = data?.data;
    const totalItems = data?.meta.totalItems || 0; // Total de registros (corrigido nome)
    
    // testes 
    


    // Função chamada ao mudar de página
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleNavigation = () => {
        navigate('/customers/create');
    };

    return (
        <>
            <Helmet>
                <title>{`Clientes - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                            Clientes
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleNavigation}>
                                Adicionar Cliente
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {isLoading ? (
                            <LoadingButton />
                        ) : (
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="Customer Table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><Checkbox /></TableCell>
                                            <TableCell>Nome</TableCell>
                                            <TableCell>Telefone</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customers?.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell><Checkbox /></TableCell>
                                                <TableCell>{row?.name}</TableCell>
                                                <TableCell>{row?.contact}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[]} // Remove opções (fixo)
                                                count={totalItems} // Total de registros
                                                rowsPerPage={rowsPerPage} // Fixo
                                                page={page} // Página atual
                                                onPageChange={handleChangePage} // Corrigido para usar a função diretamente
                                                component="div" // Para acessibilidade
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        )}
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
