import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetEmployeeById } from "src/hooks/useEmployee";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function EmployeeDetails() {
    const { id } = useParams<{ id: string }>();
    const employeeId = parseInt(id!, 10);

    const response = useGetEmployeeById(employeeId);
    const employee = response.data?.data;
    const { isLoading } = response;

    const formStyle = {
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
    };

    const navigate = useRouter();
    const handleEditClick = () => {
        navigate.replace(`/employee/edit/${id}`);
    };
    
    return (
        <>
            <Helmet>
                <title>{`Detalhes do Funcionário - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="lg">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes do Funcionário
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>
                                        {/* Nome */}
                                        <Grid item xs={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Nome: {employee?.nome}
                                            </Typography>
                                        </Grid>

                                        {/* Botão de Editar */}
                                        <Grid item xs={6}>
                                            <IconButton onClick={handleEditClick}>
                                                <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                            </IconButton>
                                        </Grid>

                                        {/* Registro Número */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Registro Número: {employee?.registroNumero}
                                            </Typography>
                                        </Grid>

                                        {/* RG */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                RG: {employee?.rg}
                                            </Typography>
                                        </Grid>

                                        {/* CPF */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                CPF: {employee?.cpf}
                                            </Typography>
                                        </Grid>

                                        {/* Contato */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Contato: {employee?.contato}
                                            </Typography>
                                        </Grid>

                                        {/* Função */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Função: {employee?.funcao}
                                            </Typography>
                                        </Grid>

                                        {/* Salário */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Salário: R$ {employee?.salario}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Admissão */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data de Admissão: {new Date(employee?.dataAdmissao || '').toLocaleDateString()}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Demissão */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data de Demissão: {employee?.dataDemissao ? new Date(employee?.dataDemissao).toLocaleDateString() : "Ativo"}
                                            </Typography>
                                        </Grid>

                                        {/* Período de Férias */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Período de Férias: {employee?.periodoFerias || "Não informado"}
                                            </Typography>
                                        </Grid>

                                        {/* Endereço */}
                                        <Grid item xs={12}>
                                            <Typography variant="h6" gutterBottom>
                                                Endereço
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                CEP: {employee?.address.cep}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                Cidade: {employee?.address.cidade}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                UF: {employee?.address.uf}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                Bairro: {employee?.address.bairro}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Endereço: {employee?.address.endereco}, Número: {employee?.address.numero}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Complemento: {employee?.address.complemento || "Não informado"}
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
