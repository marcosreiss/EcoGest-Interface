import type { ProductBasicInfo } from 'src/models/product';
import type { SupplierBasicInfo } from 'src/models/supplier';
import { PurchaseStatus, type CreatePurchasePayload } from "src/models/purchase";

import React, { useState, useMemo, useEffect } from "react";
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
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";
import { useUpdatePurchase, useGetPurchaseById } from "src/hooks/usePurchase";

import { CONFIG } from "src/config-global";
// Removido: import { PurchaseStatus } from "src/models/purchase"; // Não mais necessário
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

// Função auxiliar para converter string com vírgula para número
const parseNumber = (value: string): number => {
  if (typeof value !== 'string') return 0;
  // Remove qualquer caractere que não seja dígito, ponto ou vírgula
  const cleanedValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleanedValue);
  return Number.isNaN(parsed) ? 0 : parsed;
};

// Função auxiliar para formatar número para moeda brasileira
const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

// Defina um tipo separado para os dados do formulário
type EditPurchaseFormData = Omit<CreatePurchasePayload, 'weightAmount' | 'price' | 'status' | 'date_time'> & {
  weightAmount: string;
  price: string;
  date_time: string; // Manter como string no formulário
};

export default function EditPurchasePage() {
  const { id } = useParams<{ id: string }>();
  const purchaseId = Number(id);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const [file, setFile] = useState<Blob | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPurchaseFormData>({
    defaultValues: {
      weightAmount: '',
      price: '',
      supplierId: -1,
      productId: -1,
      description: '',
      date_time: '',
    }
  });

  const { data: purchase, isLoading: loadingPurchase } = useGetPurchaseById(purchaseId);
  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();

  const updatePurchase = useUpdatePurchase();
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.size <= 5 * 1024 * 1024) { // Limite de 5MB
      setFile(uploadedFile);
    } else {
      addNotification("Arquivo excede o limite de 5MB", "error");
    }
  };

  useEffect(() => {
    if (purchase) {
      setValue("supplierId", purchase.supplierId);
      setValue("productId", purchase.productId);
      setValue("weightAmount", purchase.weightAmount.toString());
      setValue("price", purchase.price.toString());
      // Removido: setValue("status", purchase.purchaseStatus);
      setValue("description", purchase.description || "");
      // Corrigido: Converter para Date antes de formatar
      // Verifica se purchase.date_time é uma string válida antes de converter
      const date = new Date(purchase.date_time);
      if (!Number.isNaN(date.getTime())) {
        setValue("date_time", date.toISOString().split("T")[0]); // Formato YYYY-MM-DD
      } else {
        setValue("date_time", ""); // Define vazio se a data for inválida
      }
    }
  }, [purchase, setValue]);

  const onSubmit = (data: EditPurchaseFormData) => {
    // Converte vírgula para ponto em weightAmount e price
    const parsedWeightAmount = parseNumber(data.weightAmount);
    const parsedPrice = parseNumber(data.price);

    const payload: CreatePurchasePayload = {
      ...data,
      weightAmount: parsedWeightAmount,
      price: parsedPrice,
      // Removido: status: PurchaseStatus.processing, // Não mais necessário
      paymentSlip: file,
      date_time: new Date(data.date_time),
      status: PurchaseStatus.processing
    };

    // Adiciona o status existente da purchase no payload, se necessário
    // Isso depende do backend aceitar a omissão do status ou requerer envio
    // Se precisar enviar, descomente a linha abaixo
    // payload.status = purchase?.purchaseStatus || PurchaseStatus.processing;

    updatePurchase.mutate(
      { id: purchaseId, data: payload },
      {
        onSuccess: () => {
          addNotification("Compra atualizada com sucesso!", "success");
          router.push("/purchases");
        },
        onError: (error: any) => {
          addNotification(`Erro ao atualizar compra: ${error.message}`, "error");
        },
      }
    );
  };

  // Monitora os campos 'weightAmount' e 'price'
  const weightAmountValue = watch('weightAmount');
  const priceValue = watch('price');

  // Calcula o totalPrice usando useMemo para otimizar a performance
  const totalPrice = useMemo(() => {
    const weight = parseNumber(weightAmountValue || '0');
    const price = parseNumber(priceValue || '0');
    const total = weight * price;
    return Number.isNaN(total) || total <= 0 ? '' : formatCurrency(total);
  }, [weightAmountValue, priceValue]);

  if (loadingPurchase) {
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
        <title>{`Editar Compra - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Compra
                  </Typography>
                </Grid>

                {/* Fornecedor */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={suppliers?.data || []}
                    loading={loadingSuppliers}
                    getOptionLabel={(option: SupplierBasicInfo) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.supplierId === value.supplierId
                    }
                    defaultValue={suppliers?.data?.find(
                      (supplier) => supplier.supplierId === purchase?.supplierId
                    ) || null}
                    onChange={(_, newValue) =>
                      setValue("supplierId", newValue?.supplierId || -1, {
                        shouldValidate: true,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Fornecedor"
                        variant="outlined"
                        error={!!errors.supplierId}
                        helperText={errors.supplierId?.message}
                        {...register("supplierId", { required: "Selecione um fornecedor." })}
                      />
                    )}
                  />
                </Grid>

                {/* Produto */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={products?.data || []}
                    loading={loadingProducts}
                    getOptionLabel={(option: ProductBasicInfo) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.productId === value.productId
                    }
                    defaultValue={products?.data?.find(
                      (product) => product.productId === purchase?.productId
                    ) || null}
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
                        {...register("productId", { required: "Selecione um produto." })}
                      />
                    )}
                  />
                </Grid>

                {/* Quantidade (aceitando vírgula) */}
                <Grid item xs={12}>
                  <Controller
                    name="weightAmount"
                    control={control}
                    rules={{
                      required: "Digite a quantidade.",
                      validate: {
                        isPositive: (value) =>
                          parseNumber(value) >= 0.1 || "A quantidade mínima é 0,1 tonelada.",
                      },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        fullWidth
                        label="Quantidade (Toneladas)"
                        type="text" // aceita vírgula
                        value={value ? String(value).replace(".", ",") : ""}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(",", ".");
                          onChange(inputValue || "");
                        }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Preço (aceitando vírgula) */}
                <Grid item xs={12}>
                  <Controller
                    name="price"
                    control={control}
                    rules={{
                      required: "Digite o preço.",
                      validate: {
                        isNonNegative: (value) =>
                          parseNumber(value) >= 0 || "O preço não pode ser negativo.",
                      },
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        fullWidth
                        label="Preço unitário (R$)"
                        type="text" // aceita vírgula
                        value={value ? String(value).replace(".", ",") : ""}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(",", ".");
                          onChange(inputValue || "");
                        }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Preço Total */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Preço Total (R$)"
                    value={totalPrice}
                    InputProps={{
                      readOnly: true,
                    }}
                    helperText="Preço total calculado automaticamente."
                  />
                </Grid>

                {/* Descrição */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    placeholder="Descrição da compra"
                    multiline
                    rows={4}
                    {...register("description")}
                  />
                </Grid>

                {/* Data da Compra */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data da Compra"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("date_time", { required: "Selecione uma data." })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>

                {/* Upload do arquivo */}
                <Grid item xs={12}>
                  <Button variant="contained" component="label" fullWidth>
                    Upload Nota Fiscal
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {file && file instanceof File && (
                    <Typography variant="body2">Arquivo: {file.name}</Typography>
                  )}
                </Grid>

                {/* Botão de Enviar */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                    disabled={updatePurchase.isPending}
                  >
                    Atualizar
                    {updatePurchase.isPending && (
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
  )
}
