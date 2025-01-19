import type { ProductBasicInfo } from "src/models/product";
import type { SupplierBasicInfo } from "src/models/supplier";
import type { PurchasePayload, PurchasePayloadProduct } from "src/models/purchase";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";
import { useUpdatePurchase, useGetPurchaseById } from "src/hooks/usePurchase";

import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function EditPurchasePage() {
  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<PurchasePayload>({
    defaultValues: {
      discount: 0, // Default discount to 0 if not set
    },
  });

  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
  const { data: purchase, isLoading: loadingPurchase } = useGetPurchaseById(Number(id));

  const [file, setFile] = useState<Blob | null>(null);
  const [productsList, setProductsList] = useState<PurchasePayloadProduct[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    formState: { errors: modalErrors },
  } = useForm<PurchasePayloadProduct>();

  const updatePurchase = useUpdatePurchase();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (purchase) {
      setValue("personId", purchase.supplier.personId);
      setValue("description", purchase.description);
      setValue("date_time", purchase.date_time ? purchase.date_time.split("T")[0] : "");
      setValue("discount", purchase.discount ?? 0);

      const list: PurchasePayloadProduct[] = purchase.products.map((product) => ({
        productId: product.product.productId,
        quantity: product.quantity,
        price: product.price,
      }));

      setProductsList(list);
    }
  }, [purchase, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const allowedExtensions = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedExtensions.includes(uploadedFile.type)) {
      addNotification("Formato de arquivo inválido. Apenas .pdf, .jpg e .png são permitidos.", "error");
      return;
    }
    if (uploadedFile.size > 5 * 1024 * 1024) {
      addNotification("Arquivo excede o limite de 5MB.", "error");
      return;
    }
    setFile(uploadedFile);
  };

  const handleAddProduct = (data: PurchasePayloadProduct) => {
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

  const calculateTotal = (): number => {
    const total = productsList.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    const discount = watch("discount") || 0;
    return total - discount;
  };

  const total = calculateTotal();

  const onSubmit = (data: PurchasePayload) => {
    const payload: PurchasePayload = {
      ...data,
      discount: data.discount || 0, // Ensure discount is sent as 0 if cleared
      products: productsList,
      paymentSlip: file,
      date_time: data.date_time,
    };

    updatePurchase.mutate(
      { id: Number(id), data: payload },
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

  return (
    <>
      <Helmet>
        <title>Editar Compra</title>
      </Helmet>
      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Editar Compra
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={suppliers?.data || []}
                    loading={loadingSuppliers}
                    getOptionLabel={(option: SupplierBasicInfo) => option.name}
                    isOptionEqualToValue={(option, value) => option.personId === value.personId}
                    value={
                      suppliers?.data.find((supplier) => supplier.personId === purchase?.supplier.personId) || null
                    }
                    onChange={(_, newValue) =>
                      setValue("personId", newValue ? newValue.personId : -1, {
                        shouldValidate: true,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Fornecedor"
                        variant="outlined"
                        error={!!errors.personId}
                        helperText={errors.personId?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    placeholder="Descrição da compra"
                    multiline
                    rows={3}
                    {...register("description")}
                    value={watch("description") || ""} // Garanta que o valor inicial está definido
                    onChange={(e) => setValue("description", e.target.value)} // Atualize com `setValue`
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data da Compra"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("date_time", { required: "Data é obrigatória." })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desconto (R$)"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    {...register("discount")}
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
                          <TableCell>Produto</TableCell>
                          <TableCell>Qtd</TableCell>
                          <TableCell>Preço</TableCell>
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
                            <TableCell>{product.quantity} Kg</TableCell>
                            <TableCell>R$ {product.price}</TableCell>
                            <TableCell>
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
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total da Compra"
                    value={`R$ ${total.toFixed(2)}`}
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
                    Atualizar Compra
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DashboardContent>

      {/* Modal para adicionar produto */}
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
                  variant="outlined"
                  error={!!modalErrors.price}
                  helperText={modalErrors.price?.message}
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

      {/* Dialog de confirmação para remover produto */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Remover Produto</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja remover este produto da compra?
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
    </>
  );
}
