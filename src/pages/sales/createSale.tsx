import type { CreateSalePayload } from "src/models/sale";

import React from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateSale } from "src/hooks/useSales";
import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetCustomersBasicInfo } from "src/hooks/useCustomer";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function CreateSalePage() {
  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSalePayload>();

  const createSale = useCreateSale();
  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit = (data: CreateSalePayload) => {
    // Se quiser converter vírgulas em "quantity" antes de enviar:
    const quantityStr = String(data.quantity).replace(",", ".");
    data.quantity = parseFloat(quantityStr);

    createSale.mutate(data, {
      onSuccess: () => {
        addNotification("Venda criada com sucesso!", "success");
        router.push("/sales");
      },
      onError: (error) => {
        addNotification(`Erro ao criar venda: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Venda - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 1 } }}>
                    Criar Venda
                  </Typography>
                </Grid>

                {/* Campo de Cliente */}
                <Grid item xs={12} sm={6} md={12}>
                  <Autocomplete
                    options={customers?.data || []}
                    loading={loadingCustomers}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.customerId === value.customerId
                    }
                    onChange={(_, newValue) =>
                      register("customerId", {
                        value: newValue?.customerId || undefined,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente"
                        variant="outlined"
                        error={!!errors.customerId}
                        helperText={errors.customerId?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.customerId}>
                        {option.name}
                      </li>
                    )}
                  />
                </Grid>

                {/* Campo de Produto */}
                <Grid item xs={12} sm={6} md={12}>
                  <Autocomplete
                    options={products?.data || []}
                    loading={loadingProducts}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.productId === value.productId
                    }
                    onChange={(_, newValue) =>
                      register("productId", {
                        value: newValue?.productId || undefined,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produto"
                        variant="outlined"
                        error={!!errors.productId}
                        helperText={errors.productId?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.productId}>
                        {option.name}
                      </li>
                    )}
                  />
                </Grid>

                {/* Quantidade em Toneladas (com vírgulas) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantidade (Toneladas)"
                    placeholder="Digite a quantidade em toneladas"
                    type="text"
                    {...register("quantity", {
                      required: "A quantidade é obrigatória.",
                      min: {
                        value: 0.1,
                        message: "A quantidade mínima é 0.1 tonelada.",
                      },
                    })}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                </Grid>

                {/* Data da Venda */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data da Venda"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("date_time", {
                      required: "Selecione uma data de venda.",
                    })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>

                {/* Botão Enviar */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                    disabled={createSale.isPending}
                  >
                    Enviar
                    {createSale.isPending && (
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
