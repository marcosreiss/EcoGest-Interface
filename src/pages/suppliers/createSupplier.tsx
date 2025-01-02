import type { CreateSupplierPayload } from "src/models/supplier";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import { Box, Grid, Switch, Button, TextField, Typography, FormControlLabel } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateSupplier } from "src/hooks/useSupplier";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function CreateSupplierPage() {
    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    };
    const pessoaFisica = 'Pessoa Física';
    const pessoaJuridica = 'Pessoa Jurídica';
    const [personType, setPersonType] = useState(pessoaFisica);
    const togglePersonType = () => {
        setPersonType(prev => prev === pessoaFisica ? pessoaJuridica : pessoaFisica);
    };


    const { register, handleSubmit, formState: { errors } } = useForm<CreateSupplierPayload>();
    const createSupplier = useCreateSupplier();
    const router = useRouter();
    const { addNotification } = useNotification();

    const onSubmit = (data: CreateSupplierPayload) => {
        if (personType === pessoaFisica) {
            data.cnpj = null;
            data.personType = "individual";
        } else {
            data.cpf = null;
            data.personType = "corporate";
        }
        createSupplier.mutate(data, {
            onSuccess: () => {
                addNotification("Fornecedor cadastrado com sucesso!", "success");
                router.push("/suppliers");
            },
            onError: (error: any) => {
                addNotification(`Erro ao cadastrar fornecedor: ${error.message}`, "error");
            }
        });
    };

    return (
        <>
            <Helmet>
                <title>{`Criar Fornecedor - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth='md'>
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={formStyle}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Criar Fornecedor
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome"
                                        placeholder="Nome do Fornecedor"
                                        {...register("name", { required: "O nome do fornecedor é obrigatório." })}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography component='span' fontSize={13.6} marginRight={2}>
                                        {pessoaFisica}
                                    </Typography>
                                    <FormControlLabel
                                        control={<Switch onClick={togglePersonType} checked={personType === pessoaJuridica} />}
                                        label={pessoaJuridica}
                                    />
                                </Grid>

                                {personType === pessoaFisica && (
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="CPF"
                                            placeholder="xxx.xxx.xxx-xx"
                                            type="text"
                                            {...register("cpf", { required: "Preencha o CPF do fornecedor." })}
                                            error={!!errors.cpf}
                                            helperText={errors.cpf?.message}
                                        />
                                    </Grid>
                                )}

                                {personType === pessoaJuridica && (
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="CNPJ"
                                            placeholder="xx.xxx.xxx/xxxx-xx"
                                            type="text"
                                            {...register("cnpj", { required: "Preencha o CNPJ do fornecedor." })}
                                            error={!!errors.cnpj}
                                            helperText={errors.cnpj?.message}
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Endereço"
                                        placeholder="Rua dos Anzois, Quadra 4, Nº3"
                                        {...register("address")}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contato"
                                        placeholder="(98)98923-4455"
                                        type="text"
                                        {...register("contact")}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={createSupplier.isPending}
                                    >
                                        Enviar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DashboardContent>
        </>
    );
}
