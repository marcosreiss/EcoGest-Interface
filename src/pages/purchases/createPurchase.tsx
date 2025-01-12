import type { ProductBasicInfo } from "src/models/product";
import type { SupplierBasicInfo } from "src/models/supplier";
import type { PurchaseProduct, CreatePurchasePayload } from "src/models/purchase";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

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

import { useCreatePurchase } from "src/hooks/usePurchase";
import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function CreatePurchasePage() {
  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePurchasePayload>();

  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();

  const [file, setFile] = useState<Blob | null>(null);
  const [productsList, setProductsList] = useState<PurchaseProduct[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  const [modalProduct, setModalProduct] = useState<PurchaseProduct>({
    productId: 0,
    quantity: 0,
    price: 0,
  });

  const createPurchase = useCreatePurchase();
  const { addNotification } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.size <= 5 * 1024 * 1024) {
      // Limite de 5MB
      setFile(uploadedFile);
    } else {
      addNotification("Arquivo excede o limite de 5MB", "error");
    }
  };

  const handleAddProduct = () => {
    setProductsList([...productsList, modalProduct]);
    setModalProduct({ productId: 0, quantity: 0, price: 0 });
    setModalOpen(false);
  };

  const handleRemoveProduct = () => {
    if (selectedProductIndex !== null) {
      setProductsList(productsList.filter((_, index) => index !== selectedProductIndex));
      setSelectedProductIndex(null);
      setConfirmDialogOpen(false);
    }
  };

  const onSubmit = (data: CreatePurchasePayload) => {
    const payload: CreatePurchasePayload = {
      ...data,
      products: productsList,
      paymentSlip: file,
      date_time: new Date(data.date_time),
    };

    createPurchase.mutate(payload, {
      onSuccess: () => {
        addNotification("Compra criada com sucesso!", "success");
        router.push("/purchases");
      },
      onError: (error: any) => {
        addNotification(`Erro ao criar compra: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Criar Compra</title>
      </Helmet>
      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Criar Compra
                  </Typography>
                </Grid>

                {/* Fornecedor */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={suppliers?.data || []}
                    loading={loadingSuppliers}
                    getOptionLabel={(option: SupplierBasicInfo) => option.name}
                    isOptionEqualToValue={(option, value) =>
                      option.personId === value.personId
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

                {/* Descrição */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    placeholder="Descrição da compra"
                    multiline
                    rows={3}
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
                    {...register("date_time", { required: "Data é obrigatória." })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>

                {/* Desconto */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desconto (%)"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    {...register("discount")}
                  />
                </Grid>

                {/* Produtos Adicionados */}
                <Grid item xs={12}>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => setModalOpen(true)}
                  >
                    Adicionar Produto
                  </Button>
                  {productsList.length > 0 && (
                    <Table size="small" sx={{marginTop: 3, marginBottom: 3}}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Produto</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Qtd</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Preço</TableCell>
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productsList.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                              {products?.data.find((p) => p.productId === product.productId)?.name ||
                                "Produto não encontrado"}
                            </TableCell>
                            <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                              {product.quantity}
                            </TableCell>
                            <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                              R$ {product.price.toFixed(2)}
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
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
                  >
                    Criar Compra
                    {createPurchase.isPending && (
                      <CircularProgress size={20} sx={{ marginLeft: 2 }} />
                    )}
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
        <DialogContent>
          <Autocomplete
            options={products?.data || []}
            loading={loadingProducts}
            getOptionLabel={(option: ProductBasicInfo) => option.name}
            isOptionEqualToValue={(option, value) => option.productId === value.productId}
            onChange={(_, newValue) =>
              setModalProduct((prev) => ({
                ...prev,
                productId: newValue ? newValue.productId : 0,
              }))
            }
            renderInput={(params) => <TextField {...params} label="Produto" />}
          />
          <TextField
            fullWidth
            label="Quantidade"
            type="number"
            value={modalProduct.quantity}
            onChange={(e) =>
              setModalProduct({ ...modalProduct, quantity: +e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Preço"
            type="number"
            value={modalProduct.price}
            onChange={(e) =>
              setModalProduct({ ...modalProduct, price: +e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddProduct} variant="contained">
            Adicionar
          </Button>
        </DialogActions>
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
