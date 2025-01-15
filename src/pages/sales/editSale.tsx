import type { PersonBasicInfo } from "src/models/person";
import type { SalePayload, SaleProductPayload } from "src/models/sale";

import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

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
import { useGetCustomersBasicInfo } from "src/hooks/useCustomer";
import { useUpdateSale, useGetSaleById } from "src/hooks/useSales";

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
  } = useForm<SalePayload>();

  const { data: sale, isLoading: loadingSale } = useGetSaleById(saleId);
  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const updateSale = useUpdateSale();
  const router = useRouter();
  const { addNotification } = useNotification();

  const [productsList, setProductsList] = useState<SaleProductPayload[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<SaleProductPayload>({
    productId: 0,
    quantity: 0,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  useEffect(() => {
    if (sale) {
      setValue("personId", sale.personId);
      setValue("description", sale.description);
      setValue("date_time", sale.date_time ? sale.date_time.split("T")[0] : "");
      setValue("discount", sale.discount);

      const list: SaleProductPayload[] = sale.products.map((product) => ({
        productId: product.product.productId,
        quantity: product.quantity,
      }));

      setProductsList(list);
    }
  }, [sale, setValue]);

  const handleAddProduct = () => {
    setProductsList([...productsList, modalProduct]);
    setModalProduct({ productId: 0, quantity: 0 });
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
    };

    updateSale.mutate(
      { id: saleId, data: payload },
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

  if (loadingSale || loadingProducts || loadingCustomers) {
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
        <title>Editar Venda</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" gutterBottom>
                    Editar Venda
                  </Typography>
                </Grid>

                {/* Cliente */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={customers?.data || []}
                    loading={loadingCustomers}
                    getOptionLabel={(option: PersonBasicInfo) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.personId === value.personId
                    }
                    defaultValue={customers?.data.find(
                      (customer) => customer.personId === sale?.personId
                    )}
                    onChange={(_, newValue) =>
                      setValue("personId", newValue ? newValue.personId : 0, {
                        shouldValidate: true,
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente"
                        variant="outlined"
                        error={!!errors.personId}
                        helperText={errors.personId?.message}
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
                    {...register("date_time", {
                      required: "Selecione uma data de venda.",
                    })}
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
                    <Table size="small" sx={{ marginTop: 3, marginBottom: 3 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Produto</TableCell>
                          <TableCell>Quantidade</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productsList.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {
                                products?.data.find(
                                  (p) => p.productId === product.productId
                                )?.name || "Produto não encontrado"
                              }
                            </TableCell>
                            <TableCell>{product.quantity}</TableCell>
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

                {/* Botão Atualizar */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                  >
                    Atualizar Venda
                    {updateSale.isPending && (
                      <CircularProgress size={20} sx={{ marginLeft: 2 }} />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Modal para adicionar produto */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={products?.data || []}
              loading={loadingProducts}
              getOptionLabel={(option) => option.name || ""}
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
                setModalProduct({
                  ...modalProduct,
                  quantity: +e.target.value,
                })
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

        {/* Dialog de confirmação para deletar produto */}
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
            <Button onClick={handleRemoveProduct} variant="contained" color="error">
              Remover
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardContent>
    </>
  );
}
