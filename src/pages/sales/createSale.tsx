import type { AxiosError } from "axios";
import type { PersonBasicInfo } from "src/models/person";
import type { ProductBasicInfo } from "src/models/product";
import type { ApiErrorResponse } from "src/models/errorResponse";
import type { SalePayload, SaleProductPayload } from "src/models/sale";

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Grid,
  Table,
  Button,
  Dialog,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateSale } from "src/hooks/useSales";
import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetCustomersBasicInfo } from "src/hooks/useCustomer";

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

  const router = useRouter();
  const { addNotification } = useNotification();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SalePayload>();

  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const [productsList, setProductsList] = useState<SaleProductPayload[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    formState: { errors: modalErrors },
  } = useForm<SaleProductPayload>();

  const createSale = useCreateSale();

  const handleAddProduct = (data: SaleProductPayload) => {
    setProductsList([
      ...productsList,
      {
        productId: data.productId,
        quantity: Number(data.quantity),
      },
    ]);
    resetModal();
    setModalOpen(false);
  };

  const handleRemoveProduct = () => {
    if (selectedProductIndex !== null) {
      setProductsList(productsList.filter((_, index) => index !== selectedProductIndex));
      setSelectedProductIndex(null);
      setConfirmDialogOpen(false);
    }
  };

  const calculateTotal = (): number => {
    const total = productsList.reduce((acc, product) => {
      const productInfo = products?.data.find((p) => p.productId === product.productId);
      const productPrice = Number(productInfo?.price) || 0; // Garante que seja numérico
      return acc + productPrice * product.quantity;
    }, 0);
    const discount = watch("discount") || 0;
    return total - discount;
  };

  const total = calculateTotal();

  const onSubmit = (data: SalePayload) => {
    const payload: SalePayload = {
        ...data,
        products: productsList,
        date_time: data.date_time,
    };

    createSale.mutate(payload, {
        onSuccess: () => {
            addNotification("Venda criada com sucesso!", "success");
            router.push("/sales");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            // Verifica se o erro contém uma mensagem customizada
            const errorMessage = error.response?.data?.message || "Ocorreu um erro ao criar a venda.";
            
            // Mostra a mensagem personalizada
            addNotification(`Erro ao criar venda: ${errorMessage}`, "error");
        },
    });
};


  return (
    <>
      <Helmet>
        <title>Criar Venda</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Criar Venda
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="personId"
                    control={control}
                    rules={{ required: "Cliente é obrigatório." }}
                    render={({ field }) => (
                      <Autocomplete
                        options={customers?.data || []}
                        loading={loadingCustomers}
                        getOptionLabel={(option: PersonBasicInfo) => option.name || ""}
                        isOptionEqualToValue={(option, value) => option.personId === value.personId}
                        value={
                          customers?.data.find((customer) => customer.personId === field.value) ||
                          null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.personId : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cliente"
                            variant="outlined"
                            error={!!errors.personId}
                            helperText={errors.personId?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loadingCustomers ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="date_time"
                    control={control}
                    rules={{ required: "Data da venda é obrigatória." }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Data da Venda"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date_time}
                        helperText={errors.date_time?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    placeholder="Descrição da venda"
                    multiline
                    rows={3}
                    {...register("description")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desconto"
                    placeholder="Desconto aplicado"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    {...register("discount", { valueAsNumber: true })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                  >
                    Adicionar Produto
                  </Button>
                  {productsList.length > 0 && (
                    <Table size="small" sx={{ marginTop: 3, marginBottom: 3 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Produto</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Quantidade</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Preço Unitário</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Subtotal</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productsList.map((product, index) => {
                          const productInfo = products?.data.find(
                            (p) => p.productId === product.productId
                          );
                          const productPrice = Number(productInfo?.price) || 0;
                          const subtotal = productPrice * product.quantity;
                          return (
                            <TableRow key={index}>
                              <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                                {productInfo?.name || "Produto não encontrado"}
                              </TableCell>
                              <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                                {product.quantity} Kg
                              </TableCell>
                              <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                                R$ {productPrice.toFixed(2)}
                              </TableCell>
                              <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                                R$ {subtotal.toFixed(2)}
                              </TableCell>
                              <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    setSelectedProductIndex(index);
                                    setConfirmDialogOpen(true);
                                  }}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total da Venda"
                    value={`R$ ${total.toFixed(2)}`}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
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
                    Criar Venda
                    {createSale.isPending && (
                      <CircularProgress size={20} sx={{ marginLeft: 2 }} />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <form onSubmit={handleModalSubmit(handleAddProduct)}>
            <DialogContent>
              <Controller
                name="productId"
                control={modalControl}
                rules={{ required: "Produto é obrigatório." }}
                defaultValue={undefined}
                render={({ field }) => (
                  <Autocomplete
                    options={products?.data || []}
                    loading={loadingProducts}
                    getOptionLabel={(option: ProductBasicInfo) => option.name}
                    isOptionEqualToValue={(option, value) => option.productId === value.productId}
                    value={
                      products?.data.find((product) => product.productId === field.value) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.productId : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produto"
                        placeholder="Selecione o produto"
                        variant="outlined"
                        error={!!modalErrors.productId}
                        helperText={modalErrors.productId?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingProducts ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="quantity"
                control={modalControl}
                rules={{ required: "Quantidade é obrigatória." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Quantidade"
                    type="number"
                    variant="outlined"
                    error={!!modalErrors.quantity}
                    helperText={modalErrors.quantity?.message}
                    sx={{ margin: "10px 0" }}
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">
                Adicionar
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Remover Produto</DialogTitle>
          <DialogContent>
            Tem certeza de que deseja remover este produto da venda?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleRemoveProduct}
              variant="contained"
              color="error"
            >
              Remover
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardContent>
    </>
  );
}
