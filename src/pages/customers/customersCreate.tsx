import type { CreateCustumerPayload } from "src/services/customerService";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import { Box, Grid, Switch, Button, TextField, Typography, FormControlLabel } from "@mui/material";

import { useCreateCustomer } from "src/hooks/useCustomer";

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

    const { register, handleSubmit, formState: { errors } } = useForm<CreateCustumerPayload>();
    const createCostumer = useCreateCustomer(register);

    const onSubmit = (data: CreateCustumerPayload) =>{
        console.log("criando cliente com os dados: ",data);

        if(personType === pessoaFisica){
            data.cnpj = null;
        }else{
            data.cpf = null;
        }
        createCostumer.mutate(data, {
            onSuccess: (response)=> console.log(response),
            onError: (error) => console.log(error)
        })
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
                            <form onSubmit={handleSubmit(onSubmit)}>
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
                                            {...register("name", {required: true})}
                                        />
                                        {errors?.name && (
                                            <Typography
                                            variant="body2"
                                            color="error"
                                            sx={{
                                              fontWeight: "bold",
                                              fontSize: "0.775rem",
                                              display: "flex",
                                              alignItems: "center",
                                              mt: 1
                                            }}
                                          >
                                            Preencha o nome do cliente
                                          </Typography>
                                        )}
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
                                            type="number"
                                            disabled={personType === pessoaJuridica}
                                            // required={personType === pessoaFisica}
                                            {...register("cpf", { required: personType === pessoaFisica })}
                                        />
                                        {errors?.cpf && (
                                            <Typography
                                            variant="body2"
                                            color="error"
                                            sx={{
                                              fontWeight: "bold",
                                              fontSize: "0.775rem",
                                              display: "flex",
                                              alignItems: "center",
                                              mt: 1
                                            }}
                                          >
                                            Preencha o cpf do cliente
                                          </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label={personType === pessoaJuridica ? 'cnpj' : 'disabled'}
                                            placeholder="xx.xxx.xxx/xxxx-xx"
                                            type="number"
                                            disabled={personType === pessoaFisica}
                                            {...register("cnpj", {required: personType === pessoaJuridica})}
                                        />
                                        {errors?.cnpj && (
                                                <Typography
                                                variant="body2"
                                                color="error"
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: "0.775rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  mt: 1
                                                }}
                                              >
                                                Preencha o cnpj do cliente
                                              </Typography>
                                            )}
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextField
                                            fullWidth
                                            label="Endereço"
                                            placeholder="Rua dos Anzois, Quadra 4, Nº3"
                                            {...register("address", {required: false})}
                                        />
                                    </Grid>

                                    <Grid item xs={12} >
                                        <TextField
                                            fullWidth
                                            label="Contato"
                                            placeholder="(98)98923-4455"
                                            type="number"
                                            {...register("contact", {required: true})}
                                        />
                                        {errors?.contact && (
                                                <Typography
                                                variant="body2"
                                                color="error"
                                                sx={{
                                                  fontWeight: "bold",
                                                  fontSize: "0.775rem",
                                                  display: "flex",
                                                  alignItems: "center",
                                                  mt: 1
                                                }}
                                              >
                                                Preencha o contato do cliente
                                              </Typography>
                                            )}
                                    </Grid>


                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={()=> handleSubmit(onSubmit)()}
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