import type { ProductBasicInfo } from "src/models/product";
import type { SupplierBasicInfo } from "src/models/supplier";
import type { PurchasePayload, PurchasePayloadProduct } from "src/models/purchase";

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
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
    watch,
    formState: { errors },
  } = useForm<PurchasePayload>({
    defaultValues: {
      discount: 0,
    },
  });


  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();

  const [file, setFile] = useState<Blob | null>(null);
  const [productsList, setProductsList] = useState<PurchasePayloadProduct[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);

  const {
    control,
    handleSubmit: handleModalSubmit,
    reset,
    formState: { errors: modalErrors },
    setValue: setProductValue
  } = useForm<PurchasePayloadProduct>();

  const createPurchase = useCreatePurchase();
  const { addNotification } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];

    if (!uploadedFile) {
      return;
    }

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

  const calculateTotal = (): number => {
    const total = productsList.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    const discount = parseFloat(String(watch("discount")) || "0"); // Força o valor para string
    return Math.max(total - discount, 0); // Evita valores negativos no total
  };

  const handleAddProduct = (data: PurchasePayloadProduct) => {
    if (isEditingProduct && selectedProductIndex !== null) {
      // Atualiza o produto existente no índice selecionado
      const updatedProducts = [...productsList];
      updatedProducts[selectedProductIndex] = {
        productId: data.productId,
        quantity: Number(data.quantity),
        price: Number(data.price),
      };
      setProductsList(updatedProducts);
      setIsEditingProduct(false);
      setSelectedProductIndex(null);
    } else {
      // Verifica se o produto já foi adicionado
      const existingProduct = productsList.find(
        (product) => product.productId === data.productId
      );

      if (existingProduct) {
        // Exibe a notificação de erro
        addNotification(
          "Produto já adicionado, edite para alterar a quantidade ou preço.",
          "error"
        );
        // Fecha o modal e reseta o formulário
        setModalOpen(false);
        reset();
        return;
      }

      // Adiciona um novo produto
      setProductsList([
        ...productsList,
        {
          productId: data.productId,
          quantity: Number(data.quantity),
          price: Number(data.price),
        },
      ]);
    }

    // Reseta o formulário e fecha o modal após adicionar ou editar
    reset();
    setModalOpen(false);
  };

  const handleEditProductClick = (product: PurchasePayloadProduct, index: number) => {
    setProductValue("productId", product.productId);
    setProductValue("price", product.price);
    setProductValue("quantity", product.quantity);
    setIsEditingProduct(true);
    setSelectedProductIndex(index); // Define o índice do produto a ser editado
    setModalOpen(true);
  }

  const handleRemoveProduct = () => {
    if (selectedProductIndex !== null) {
      setProductsList(productsList.filter((_, index) => index !== selectedProductIndex));
      setSelectedProductIndex(null);
      setConfirmDialogOpen(false);
    }
  };

  const onSubmit = (data: PurchasePayload) => {
    const payload: PurchasePayload = {
      ...data,
      products: productsList,
      paymentSlip: file,
      date_time: data.date_time,
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

  const total: number = calculateTotal();

  return (
    <>
      <Helmet>
        <title>Criar Compra</title>
      </Helmet>
      <DashboardContent maxWidth="lg">
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
                      option.personId === value?.personId
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

                {/* Nota Fiscal  */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="NF-e"
                    placeholder="Nota Fiscal Eletrônica"
                    {...register("nfe", { maxLength: 15 })}
                  />
                  {errors.nfe && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.775rem",
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      Máximo de 15 caracteres
                    </Typography>
                  )}
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

                {/* Data do Vencimento */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data do Vencimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataVencimento", { required: "Data é obrigatória." })}
                    error={!!errors.dataVencimento}
                    helperText={errors.dataVencimento?.message}
                  />
                </Grid>

                {/* Desconto */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desconto (R$)"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="end">R$</InputAdornment>,
                    }}
                    {...register("discount", { setValueAs: (v) => (v === "" ? 0 : parseFloat(v)) })}
                  />
                </Grid>

                {/* Produtos Adicionados */}
                <Grid item xs={12}>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={() => {
                      setModalOpen(true);
                      setIsEditingProduct(false); // Garantir que não está em modo de edição ao adicionar
                      setSelectedProductIndex(null);
                      reset(); // Resetar o formulário ao abrir o modal para adicionar
                    }}
                  >
                    Adicionar Produto
                  </Button>
                  {productsList.length > 0 && (
                    <Table size="small" sx={{ marginTop: 3, marginBottom: 3 }}>
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
                              {product.quantity} Kg
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
                              <IconButton
                                color="info"
                                onClick={() => handleEditProductClick(product, index)} // Passar o índice do produto
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Grid>

                {/* Total da Compra */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Total da Compra"
                    value={`R$ ${total.toFixed(2)}`}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
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

      {/* Modal para adicionar/editar produto */}
      <Dialog open={modalOpen} onClose={() => {
        setModalOpen(false);
        setIsEditingProduct(false);
        setSelectedProductIndex(null);
        reset(); // Resetar o formulário ao fechar o modal
      }}>
        <DialogTitle>
          {isEditingProduct ? "Editar Produto" : "Adicionar Produto"}
        </DialogTitle>
        <form onSubmit={handleModalSubmit(handleAddProduct)}>
          <DialogContent>
            {/* produto */}
            <Controller
              name="productId"
              control={control}
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
                  disabled={isEditingProduct}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Produto"
                      placeholder="Selecione o produto"
                      variant="outlined"
                      error={!!modalErrors.productId}
                      helperText={modalErrors.productId?.message}
                      disabled={isEditingProduct}
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
            {/* Quantidade  */}
            <Controller
              name="quantity"
              control={control}
              rules={{ required: "Quantidade é obrigatória." }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Quantidade (Kg)"
                  type="number"
                  variant="outlined"
                  error={!!modalErrors.quantity}
                  helperText={modalErrors.quantity?.message}
                  sx={{ margin: "10px 0" }}
                />
              )}
            />
            {/* Preço */}
            <Controller
              name="price"
              control={control}
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
            <Button onClick={() => {
              setModalOpen(false);
              setIsEditingProduct(false);
              setSelectedProductIndex(null);
              reset(); // Resetar o formulário ao cancelar
            }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {isEditingProduct ? "Editar" : "Adicionar"}
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
