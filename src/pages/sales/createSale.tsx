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
  DialogActions,
  DialogContent,
  InputAdornment,
  CircularProgress,
  Autocomplete,
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

  // Main form for creating the sale
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<SalePayload>({
    defaultValues: {
      discount: 0,
    },
  });

  // Modal form for adding products
  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    formState: { errors: modalErrors },
  } = useForm<SaleProductPayload>();

  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const [productsList, setProductsList] = useState<SaleProductPayload[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  const createSale = useCreateSale();

  const calculateTotal = (): number => {
    const total = productsList.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    const discount = parseFloat(String(watch("discount")) || "0");
    return Math.max(total - discount, 0); // Evita valores negativos
  };

  const handleAddProduct = (data: SaleProductPayload) => {
    setProductsList([
      ...productsList,
      {
        productId: data.productId,
        quantity: Number(data.quantity),
        price: Number(data.price),
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

  };

  const total = calculateTotal();

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

                {/* Data da Venda */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data da Venda"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("date_time", { required: "Data é obrigatória." })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>

                {/* Descrição */}
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

                {/* Desconto */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desconto (R$)"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    {...register("discount", { setValueAs: (v) => (v === "" ? 0 : parseFloat(v)) })}
                  />
                </Grid>

                {/* Produtos */}
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
                          <TableCell>Produto</TableCell>
                          <TableCell>Qtd</TableCell>
                          <TableCell>Preço</TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productsList.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {products?.data.find((p) => p.productId === product.productId)?.name ||
                                "Produto não encontrado"}
                            </TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                            <TableCell>
                              R$ {(product.price * product.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setSelectedProductIndex(index);
                                  setConfirmDialogOpen(true);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Grid>

                {/* Total */}
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

                {/* Botão de Criar Venda */}
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

        {/* Modal de Adicionar Produto */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <form onSubmit={handleModalSubmit(handleAddProduct)}>
            <DialogContent sx={{ mb: 2 }}>
              <Controller
                name="productId"
                control={modalControl}
                rules={{ required: "Produto é obrigatório." }}
                render={({ field }) => (
                  <Autocomplete
                    options={products?.data || []}
                    loading={loadingProducts}
                    getOptionLabel={(option: ProductBasicInfo) => option.name}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue.productId : null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produto"
                        placeholder="Selecione o produto"
                        error={!!modalErrors.productId}
                        helperText={modalErrors.productId?.message}
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
                    sx={{ mb: 2 }}
                    fullWidth
                    label="Quantidade"
                    type="number"
                    error={!!modalErrors.quantity}
                    helperText={modalErrors.quantity?.message}
                  />
                )}
              />
              <Controller
                name="price"
                control={modalControl}
                rules={{ required: "Preço é obrigatório." }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Preço"
                    type="number"
                    error={!!modalErrors.price}
                    helperText={modalErrors.price?.message}
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

        {/* Modal de Confirmar Remoção */}
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
