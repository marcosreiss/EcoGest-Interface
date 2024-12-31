import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetCustomerById } from "src/hooks/useCustomer";

import { CONFIG } from "src/config-global";
import { PersonType } from "src/models/customers";
import { DashboardContent } from "src/layouts/dashboard";



export default function Page() {
    const { id } = useParams<{ id: string }>();
    const customerId = parseInt(id!, 10);

    const response = useGetCustomerById(customerId);
    const customer = response.data;
    const isloading = response.isLoading;


    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    }
    const navigate = useRouter();
    const handleEditClick = () => {
        navigate.replace(`/customers/edit/${id}`);
    };


    return (
        <>
            <Helmet>
                <title>{`Detalhes do Cliente - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="md">
                {isloading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes do Cliente
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>

                                        {/* Nome */}
                                        <Grid item xs={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Nome: {customer?.name}
                                            </Typography>
                                        </Grid>
                                        {/* Botão de Voltar ou Editar (dependendo da lógica da aplicação) */}
                                        <Grid item xs={6}>
                                            <IconButton onClick={handleEditClick} >
                                                <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                            </IconButton>
                                        </Grid>

                                        {/* Tipo de Pessoa (Física ou Jurídica) */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" component="span" marginRight={2}>
                                                Tipo: {customer?.personType === PersonType.Individual ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                            </Typography>
                                        </Grid>

                                        {/* CPF */}
                                        {customer?.personType === PersonType.Individual && (
                                            <Grid item xs={12}>
                                                <Typography variant="body1" gutterBottom>
                                                    CPF: {customer?.cpf}
                                                </Typography>
                                            </Grid>
                                        )}

                                        {/* CNPJ */}
                                        {customer?.personType === PersonType.Corporate && (
                                            <Grid item xs={12}>
                                                <Typography variant="body1" gutterBottom>
                                                    CNPJ: {customer?.cnpj}
                                                </Typography>
                                            </Grid>
                                        )}

                                        {/* Endereço */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Endereço: {customer?.address}
                                            </Typography>
                                        </Grid>

                                        {/* Contato */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Contato: {customer?.contact}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DashboardContent>
        </>
    );
}