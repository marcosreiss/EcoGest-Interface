import type { CreateSalePayload } from "src/models/sale";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

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
    control, // Para uso do Controller
    formState: { errors },
  } = useForm<CreateSalePayload>({
    defaultValues: {
      productId: undefined, // Inicialmente nulo
    },
  });

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
      setValue("date_time", sale.date_time ? sale.date_time.split("T")[0] : "");
    }
  }, [sale, setValue]);

  const onSubmit = (formData: CreateSalePayload) => {
    console.log("Dados do formulário antes da submissão:", formData);
    // Converte vírgulas para ponto
    if (formData.quantity) {
      const quantityStr = String(formData.quantity).replace(",", ".");
      formData.quantity = parseFloat(quantityStr);
    }
    if (formData.totalPrice) {
      const priceStr = String(formData.totalPrice).replace(",", ".");
      formData.totalPrice = parseFloat(priceStr);
    }

    console.log("Dados do formulário após conversão:", formData);

    // Certifique-se de que o productId está presente
    if (!formData.productId) {
      addNotification("Selecione um produto válido.", "error");
      return;
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

  if (loadingSale || loadingProducts) {
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                      Editar Venda
                    </Typography>
                  </Grid>

                  {/* Produto com Controller */}
                  <Grid item xs={12}>
                    <Controller
                      name="productId"
                      control={control}
                      rules={{ required: "Selecione um produto." }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Autocomplete
                          options={products?.data || []}
                          loading={loadingProducts}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, selectedValue) =>
                            option.productId === selectedValue.productId
                          }
                          value={
                            products?.data.find((product) => product.productId === value) || null
                          }
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.productId : null);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Produto"
                              variant="outlined"
                              error={!!error}
                              helperText={error ? error.message : null}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  {/* Quantidade (aceita vírgula) */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Quantidade (Kilogramas)"
                      type="text" // texto para aceitar vírgula
                      {...register("quantity", {
                        required: "Digite a quantidade.",
                        min: {
                          value: 0.1,
                          message: "A quantidade mínima é 0,1 kilograma.",
                        },
                        validate: (value) => {
                          const parsed = parseFloat(value.toString().replace(",", "."));
                          return !Number.isNaN(parsed) || "Quantidade inválida.";
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
                      {...register("date_time", { required: "Selecione uma data." })}
                      defaultValue={sale?.date_time ? sale.date_time.split("T")[0] : ""}
                      InputLabelProps={{ shrink: true }}
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
                      disabled={updateSale.isPending}
                    >
                      Atualizar
                      {updateSale.isPending && (
                        <CircularProgress size={20} sx={{ marginLeft: "20px" }} />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
