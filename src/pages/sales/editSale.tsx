import type { CreateSalePayload } from "src/models/sale";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Grid,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useUpdateSale, useGetSaleById } from "src/hooks/useSales";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function EditSalePage() {
  const { id } = useParams<{ id: string }>();
  const saleId = Number(id);

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
    setValue,
    formState: { errors },
  } = useForm<CreateSalePayload>();

  const { data: sale, isLoading: loadingSale } = useGetSaleById(saleId);
  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();

  const updateSale = useUpdateSale();
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (sale) {
      setValue("customerId", sale.customerId);
      setValue("productId", sale.productId);
      setValue("quantity", sale.quantity);
      setValue("totalPrice", sale.totalPrice);
      setValue("saleStatus", sale.saleStatus);
      setValue("date_time", sale.date_time);
    }
  }, [sale, setValue]);

  const onSubmit = (formData: CreateSalePayload) => {
    // Converte vírgulas para ponto
    if (formData.quantity) {
      const quantityStr = String(formData.quantity).replace(",", ".");
      formData.quantity = parseFloat(quantityStr);
    }
    if (formData.totalPrice) {
      const priceStr = String(formData.totalPrice).replace(",", ".");
      formData.totalPrice = parseFloat(priceStr);
    }

    updateSale.mutate(
      { id: saleId, data: formData },
      {
        onSuccess: () => {
          addNotification("Venda atualizada com sucesso!", "success");
          router.push("/sales");
        },
        onError: (error) => {
          addNotification(`Erro ao atualizar venda: ${error.message}`, "error");
        },
      }
    );
  };

  if (loadingSale) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Venda - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Venda
                  </Typography>
                </Grid>

                {/* Produto */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={products?.data || []}
                    loading={loadingProducts}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.productId === value.productId
                    }
                    defaultValue={products?.data.find(
                      (product) => product.productId === sale?.productId
                    )}
                    onChange={(_, newValue) =>
                      setValue("productId", newValue?.productId || -1, {
                        shouldValidate: true,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produto"
                        variant="outlined"
                        error={!!errors.productId}
                        helperText={errors.productId?.message}
                        {...register("productId", {
                          required: "Selecione um produto.",
                        })}
                      />
                    )}
                  />
                </Grid>

                {/* Quantidade (aceita vírgula) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantidade (Toneladas)"
                    type="text" // texto para aceitar vírgula
                    {...register("quantity", {
                      required: "Digite a quantidade.",
                      min: {
                        value: 0.1,
                        message: "A quantidade mínima é 0.1 tonelada.",
                      },
                    })}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                </Grid>

                {/* Preço Total (aceita vírgula) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Preço Total (R$)"
                    type="text" // texto para aceitar vírgula
                    {...register("totalPrice", {
                      required: "Digite o preço total.",
                      min: 0,
                    })}
                    error={!!errors.totalPrice}
                    helperText={errors.totalPrice?.message}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Status"
                    fullWidth
                    disabled={sale?.saleStatus !== "processing"}
                    defaultValue={sale?.saleStatus || ""}
                    {...register("saleStatus", {
                      required: "Selecione um status.",
                    })}
                    error={!!errors.saleStatus}
                    helperText={errors.saleStatus?.message}
                  >
                    <MenuItem value="processing">Pendente</MenuItem>
                    <MenuItem value="approved">Concluído</MenuItem>
                    <MenuItem value="canceled">Cancelado</MenuItem>
                  </TextField>
                </Grid>

                {/* Data da Venda */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data da Venda"
                    type="date"
                    value={sale?.date_time ? sale.date_time.split("T")[0] : ""}
                    InputLabelProps={{ shrink: true }}
                    {...register("date_time", { required: "Selecione uma data." })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>

                {/* Botão de Enviar */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateSale.isPending}
                  >
                    Atualizar
                    {updateSale.isPending && (
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
