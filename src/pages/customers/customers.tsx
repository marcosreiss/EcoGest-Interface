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
import { Box, Grid, Button, Checkbox, Typography } from '@mui/material';

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
    const totalItemsRef = React.useRef(0);

    // Define totalItems apenas na primeira chamada
    if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
        totalItemsRef.current = data.meta.totalItems;
    }

    // Use totalItemsRef.current onde necessário
    const totalItems = totalItemsRef.current;

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
                        <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
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

                        <TableContainer
                            component={Paper}
                            sx={{
                                height: '65vh', // Altura máxima total
                                display: 'flex',
                                flexDirection: 'column', // Organiza a tabela e o footer em colunas
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1, // Faz a tabela ocupar o espaço disponível
                                    overflow: 'auto', // Permite scroll apenas no conteúdo da tabela
                                }}
                            >
                                <Table stickyHeader aria-label="Customer Table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    width: '5%', // Largura fixa para checkbox
                                                    minWidth: '50px', // Evita colapsar
                                                }}
                                            >
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    width: '47.5%', // Largura maior para nome
                                                    minWidth: '150px',
                                                }}
                                            >
                                                Nome
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    width: '47.5%', // Largura maior para telefone
                                                    minWidth: '150px',
                                                }}
                                            >
                                                Telefone
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <LoadingButton />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            customers?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Checkbox />
                                                    </TableCell>
                                                    <TableCell>{row?.name}</TableCell>
                                                    <TableCell>{row?.contact}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                            <Box
                                sx={{
                                    borderTop: '1px solid #ddd', // Linha para separar o footer
                                }}
                            >
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[]} // Remove opções (fixo)
                                            count={totalItems} // Total de registros
                                            rowsPerPage={rowsPerPage} // Fixo
                                            page={page} // Página atual
                                            onPageChange={handleChangePage} // Corrigido para usar a função diretamente
                                            component="div" // Para acessibilidade
                                            sx={{width: '800px'}}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Box>
                        </TableContainer>


                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
