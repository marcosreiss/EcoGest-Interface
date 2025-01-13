import type { PersonBasicInfo } from "src/models/person";
import type { SalePayload, SaleProductPayload } from "src/models/sale";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Grid,
  Table,
  Button,
  Dialog,
  TableRow,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
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
    setValue,
    formState: { errors },
  } = useForm<SalePayload>();

  const createSale = useCreateSale();
  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const [productsList, setProductsList] = useState<SaleProductPayload[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<SaleProductPayload>({
    productId: 0,
    quantity: 0,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  const router = useRouter();
  const { addNotification } = useNotification();

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

    createSale.mutate(payload, {
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
                  <Typography variant="h4" gutterBottom>
                    Criar Venda
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

                {/* Botão Enviar */}
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

        {/* Modal para adicionar produto */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Adicionar Produto</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={products?.data || []}
              loading={loadingProducts}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) =>
                option.productId === value.productId
              }
              onChange={(_, newValue) =>
                setModalProduct((prev) => ({
                  ...prev,
                  productId: newValue ? newValue.productId : 0,
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Produto" />
              )}
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

        {/* Confirm Dialog para Deletar Produto */}
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
