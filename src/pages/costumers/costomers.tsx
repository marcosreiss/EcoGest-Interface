import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import { Grid, Button, Checkbox, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

// Criação de dados fictícios dos clientes
function createData(name: string, phone: string) {
    return { name, phone };
}

const rows = [
    createData('João Silva', '(11) 91234-5678'),
    createData('Maria Oliveira', '(21) 99876-5432'),
    createData('Carlos Souza', '(31) 98765-4321'),
    createData('Ana Paula', '(41) 97654-3210'),
    createData('Bruno Mendes', '(51) 96543-2109'),
    createData('João Silva', '(11) 91234-5678'),
    createData('Maria Oliveira', '(21) 99876-5432'),
    createData('Carlos Souza', '(31) 98765-4321'),
    createData('Ana Paula', '(41) 97654-3210'),
    createData('Bruno Mendes', '(51) 96543-2109'),
    createData('João Silva', '(11) 91234-5678'),
    createData('Maria Oliveira', '(21) 99876-5432'),
    createData('Carlos Souza', '(31) 98765-4321'),
    createData('Ana Paula', '(41) 97654-3210'),
    createData('Bruno Mendes', '(51) 96543-2109'),
    createData('João Silva', '(11) 91234-5678'),
    createData('Maria Oliveira', '(21) 99876-5432'),
    createData('Carlos Souza', '(31) 98765-4321'),
    createData('Ana Paula', '(41) 97654-3210'),
    createData('Bruno Mendes', '(51) 96543-2109'),
];


export default function Page() {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/costumers/create');
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
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell><Checkbox /></TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.phone}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DashboardContent>
            </>
        )
    }