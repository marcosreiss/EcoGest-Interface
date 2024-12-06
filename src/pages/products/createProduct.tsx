import type { SubmitHandler } from "react-hook-form";
import type { CreateProductPayload } from "src/models/product";

import React from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import { Box, Grid, Button, TextField, Typography } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateProduct } from "src/hooks/useProduct";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function CreateProductPage() {
    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    };

    const { register, handleSubmit, formState: { errors } } = useForm<CreateProductPayload>();
    const createProduct = useCreateProduct();
    const router = useRouter();
    const { addNotification } = useNotification();

    const onSubmit: SubmitHandler<CreateProductPayload> = (data) => {
        // Força a conversão dos valores para número
        const formattedData = {
            ...data,
            weightAmount: Number(data.weightAmount),
            price: Number(data.price)
        };
    
        createProduct.mutate(formattedData, {
            onSuccess: () => {
                addNotification("Produto cadastrado com sucesso!", "success");
                router.push("/products");
            },
            onError: (error: any) => {
                addNotification(`Erro ao cadastrar produto: ${error.message}`, "error");
            }
        });
    };
    

    return (
        <>
            <Helmet>
                <title>{`Criar Produto - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth='md'>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <Box sx={formStyle}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Criar Produto
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome"
                                        placeholder="Nome do Produto"
                                        {...register("name", { required: "O nome do produto é obrigatório." })}
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade (Kg)"
                                        placeholder="Ex: 500"
                                        type="number"
                                        inputProps={{ min: 0, step: "any" }}
                                        {...register("weightAmount", { 
                                            required: "A quantidade é obrigatória.",
                                            min: { value: 0, message: "A quantidade não pode ser negativa." }
                                        })}
                                        error={!!errors.weightAmount}
                                        helperText={errors.weightAmount?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço (R$)"
                                        placeholder="Ex: 150.00"
                                        type="number"
                                        inputProps={{ min: 0, step: "0.01" }}
                                        {...register("price", { 
                                            required: "O preço é obrigatório.",
                                            min: { value: 0, message: "O preço não pode ser negativo." }
                                        })}
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleSubmit(onSubmit)}
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
