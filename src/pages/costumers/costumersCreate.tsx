import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { Box, Grid, Switch, Button, TextField, Typography, FormControlLabel } from "@mui/material";

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
    const pessoaFisica = 'Pessoa Física';
    const pessoaJuridica ='Pessoa Jurídica';
    const [personType, setPersonType] = useState(pessoaFisica)
    const togglePersonType = () => {
        if (personType === pessoaFisica) {
            setPersonType(pessoaJuridica)
        } else {
            setPersonType(pessoaFisica)
        }
    }

    return (
        <>
            <Helmet>
                <title>{`Criar Cliente - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth='md' >
                <Grid container>


                    <Grid item xs={12} >
                        <Box sx={formStyle}>
                            <form>
                                <Grid container spacing={2} >
                                    <Grid item xs={6}>
                                        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                            Criar Cliente
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextField
                                            fullWidth
                                            label="name"
                                            placeholder="Maria José"
                                            name="name"
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography component='span' fontSize={13.6} marginRight={2}>
                                            {pessoaFisica}
                                        </Typography>
                                        <FormControlLabel
                                            control={<Switch onClick={togglePersonType} defaultChecked={false} />}
                                            label={pessoaJuridica}
                                        />
                                    </Grid>

                                    <Grid item xs={6} >
                                        <TextField
                                            fullWidth
                                            label={personType === pessoaFisica ? 'cpf' : 'disabled'}
                                            placeholder="xxx.xxx.xxx-xx"
                                            name="cpf"
                                            type="number"
                                            disabled={personType === pessoaJuridica}
                                            required={personType === pessoaFisica}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label={personType === pessoaJuridica ? 'cnpj' : 'disabled'}
                                            placeholder="xx.xxx.xxx/xxxx-xx"
                                            name="cnpj"
                                            type="number"
                                            disabled={personType === pessoaFisica}
                                            required={personType === pessoaJuridica}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextField
                                            fullWidth
                                            label="Endereço"
                                            placeholder="Rua dos Anzois, Quadra 4, Nº3"
                                            name="endereco"
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextField
                                            fullWidth
                                            label="Contato"
                                            placeholder="(98)98923-4455"
                                            name="cnpj"
                                            type="number"
                                            required
                                        />
                                    </Grid>


                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Enviar
                                        </Button>
                                    </Grid>

                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    )
}