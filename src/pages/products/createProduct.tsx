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
    // Converte vírgula para ponto e faz parseFloat
    const weightAmountStr = (data.weightAmount || '').toString().replace(',', '.');
    const priceStr = (data.price || '').toString().replace(',', '.');

    // Cria um novo objeto com os valores convertidos em número
    const formattedData = {
      ...data,
      weightAmount: parseFloat(weightAmountStr),
      price: parseFloat(priceStr),
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

      <DashboardContent maxWidth='lg'>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Produto
                  </Typography>
                </Grid>

                {/* Nome */}
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

                {/* Quantidade (Toneladas) */}
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantidade (Quilos)"
                    placeholder="Ex: 1,5"
                    type="text"
                    inputProps={{ min: 0, step: "any" }}
                    {...register("weightAmount", {
                      required: "A quantidade é obrigatória.",
                    })}
                    error={!!errors.weightAmount}
                    helperText={errors.weightAmount?.message}
                  />
                </Grid> */}

                {/* Preço (R$) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Preço (R$)"
                    placeholder="Ex: 150,00"
                    type="text"
                    inputProps={{ min: 0, step: "0.01" }}
                    {...register("price", {
                      required: "O preço é obrigatório.",
                    })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Grid>

                {/* Botão de Envio */}
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
