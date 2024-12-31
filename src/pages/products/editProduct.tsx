import type { Product } from "src/models/product";
import type { SubmitHandler } from "react-hook-form";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useUpdateProduct, useGetProductById } from "src/hooks/useProduct";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Product>();
  const updateProduct = useUpdateProduct();
  const router = useRouter();
  const { addNotification } = useNotification();

  const { data: product, isLoading, isError, error } = useGetProductById(productId);

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("weightAmount", product.weightAmount);
      setValue("price", product.price);
    }
  }, [product, setValue]);

  const onSubmit: SubmitHandler<Product> = (data) => {
    const updatedData: Product = {
      ...data,
    };

    updateProduct.mutate(
      { id: productId, data: updatedData },
      {
        onSuccess: () => {
          addNotification("Produto atualizado com sucesso!", "success");
          router.push("/products");
        },
        onError: (err: any) => {
          addNotification(`Erro ao atualizar produto: ${err.message}`, "error");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (isError) {
    return (
      <DashboardContent>
        <Box sx={formStyle}>
          <Typography variant="h6" color="error">
            Erro ao carregar o produto: {error?.message}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Produto - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Produto
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
                    label="Quantidade (Toneladas)"
                    placeholder="Ex: 1.5"
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
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={updateProduct.isPending}
                  >
                    Atualizar
                    {updateProduct.isPending && (
                      <CircularProgress size={20} sx={{ marginLeft: "20px" }} />
                    )}
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
