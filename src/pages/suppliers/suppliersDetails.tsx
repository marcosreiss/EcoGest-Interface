import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetSupplierById } from "src/hooks/useSupplier";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function SupplierDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const supplierId = parseInt(id!, 10);

    const response = useGetSupplierById(supplierId);
    const supplier = response.data;
    const {isLoading, isError, error} = response;

    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    };
    const navigate = useRouter();
    const handleEditClick = () => {
        navigate.replace(`/suppliers/edit/${id}`);
    };

    return (
        <>
            <Helmet>
                <title>{`Detalhes do Fornecedor - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="md">
                {isLoading ? (
                    <LinearProgress />
                ) : isError ? (
                    <Box sx={formStyle}>
                        <Typography variant="h6" color="error">
                            Erro ao carregar o fornecedor: {error?.message}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes do Fornecedor
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>
                                        {/* Nome */}
                                        <Grid item xs={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Nome: {supplier?.name}
                                            </Typography>
                                        </Grid>
                                        {/* Botão de Editar */}
                                        <Grid item xs={6}>
                                            <IconButton onClick={handleEditClick}>
                                                <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                            </IconButton>
                                        </Grid>

                                        {/* CPF */}
                                        {supplier?.cpf && (
                                            <Grid item xs={12}>
                                                <Typography variant="body1" gutterBottom>
                                                    CPF: {supplier.cpf}
                                                </Typography>
                                            </Grid>
                                        )}

                                        {/* CNPJ */}
                                        {supplier?.cnpj && (
                                            <Grid item xs={12}>
                                                <Typography variant="body1" gutterBottom>
                                                    CNPJ: {supplier.cnpj}
                                                </Typography>
                                            </Grid>
                                        )}

                                        {/* Endereço */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Endereço: {supplier?.address}
                                            </Typography>
                                        </Grid>

                                        {/* Contato */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Contato: {supplier?.contact}
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
