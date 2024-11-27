import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { LoadingButton } from '@mui/lab';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import { Grid, Button, Checkbox, Typography } from '@mui/material';

import { useGetCustomersPaginaded } from 'src/hooks/useCustomer';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Page() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetCustomersPaginaded(0, 10);
    console.log(data);
    const customers = data?.data;

    const handleNavigation = () => {
        navigate('/customers/create');
    };
    return (
        <>
            <Helmet>
                <title>{`Clientes - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth='md' >

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
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.contact}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    )
}