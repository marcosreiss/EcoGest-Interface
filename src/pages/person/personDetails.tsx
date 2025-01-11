import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetPersonById } from "src/hooks/usePerson";

import { CONFIG } from "src/config-global";
import { PersonType } from "src/models/person";
import { DashboardContent } from "src/layouts/dashboard";

export default function PersonDetails() {
    const { id } = useParams<{ id: string }>();
    const personId = parseInt(id!, 10);

    const response = useGetPersonById(personId);
    const person = response.data;
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
        navigate.replace(`/person/edit/${id}`);
    };

    return (
        <>
            <Helmet>
                <title>{`Detalhes da Pessoa - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="md">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes da Pessoa
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>
                                        {/* Nome */}
                                        <Grid item xs={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Nome: {person?.name}
                                            </Typography>
                                        </Grid>

                                        {/* Botão de Editar */}
                                        <Grid item xs={6}>
                                            <IconButton onClick={handleEditClick}>
                                                <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                            </IconButton>
                                        </Grid>

                                        {/* Tipo de Pessoa */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Tipo:{" "}
                                                {person?.type === PersonType.cliente
                                                    ? "Cliente"
                                                    : "Fornecedor"}
                                            </Typography>
                                        </Grid>

                                        {/* CPF/CNPJ */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                {person?.cpfCnpj?.length && person.cpfCnpj.length > 14 ? "CNPJ" : "CPF"}:{" "}
                                                {person?.cpfCnpj}
                                            </Typography>
                                        </Grid>

                                        {/* Contato */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Contato: {person?.contact}
                                            </Typography>
                                        </Grid>

                                        {/* Email */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Email: {person?.email}
                                            </Typography>
                                        </Grid>

                                        {/* Observação */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Observação: {person?.obs || "Não informado"}
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
                                                CEP: {person?.address.cep}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                Cidade: {person?.address.cidade}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                UF: {person?.address.uf}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                Bairro: {person?.address.bairro}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Endereço: {person?.address.endereco}, Número: {person?.address.numero}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Complemento: {person?.address.complemento || "Não informado"}
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
