import { Helmet } from "react-helmet-async";

import { Box, Grid, Typography, IconButton } from "@mui/material";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";



export default function Page() {

    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    }


    return (
        <>
            <Helmet>
                <title>{`Detalhes do Cliente - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="md">
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
                                        Nome: Marcos Reis
                                    </Typography>
                                </Grid>
                                {/* Botão de Voltar ou Editar (dependendo da lógica da aplicação) */}
                                <Grid item xs={6}>
                                    <IconButton onClick={() => alert('Editar Cliente')} >
                                        <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                    </IconButton>
                                </Grid>

                                {/* Tipo de Pessoa (Física ou Jurídica) */}
                                <Grid item xs={12}>
                                    <Typography variant="body1" component="span" marginRight={2}>
                                        Tipo: Pessoa Física
                                    </Typography>
                                </Grid>

                                {/* CPF */}
                                {true && (
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            CPF: 60921143303
                                        </Typography>
                                    </Grid>
                                )}

                                {/* CNPJ */}
                                {true && (
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            CNPJ: 68168491841984
                                        </Typography>
                                    </Grid>
                                )}

                                {/* Endereço */}
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom>
                                        Endereço: Rua dos anzois, nº 514
                                    </Typography>
                                </Grid>

                                {/* Contato */}
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom>
                                        Contato: 98989133135
                                    </Typography>
                                </Grid>

                                
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}