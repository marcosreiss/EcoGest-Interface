import type { ProductBasicInfo } from "src/models/product";
import type { SupplierBasicInfo } from "src/models/supplier";
import type { PurchasePayload, PurchasePayloadProduct } from "src/models/purchase";

import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
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
    watch,
    control,
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
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);

  const {
    control: productControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    formState: { errors: modalErrors },
    setValue: setProductValue,
  } = useForm<PurchasePayloadProduct>();

  const updatePurchase = useUpdatePurchase();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (purchase) {
      setValue("personId", purchase.supplier.personId);
      setValue("description", purchase.description);
      setValue("date_time", purchase.date_time ? purchase.date_time.split("T")[0] : "");
      setValue("discount", purchase.discount ?? 0);
      setValue("nfe", purchase.nfe);
      setValue(
        "dataVencimento",
        purchase.payable.dataVencimento
          ? purchase.payable.dataVencimento.split("T")[0]
          : ""
      );

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
      addNotification(
        "Formato de arquivo inválido. Apenas .pdf, .jpg e .png são permitidos.",
        "error"
      );
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
        resetModal();
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
    resetModal();
    setModalOpen(false);
  };

  const handleEditProductClick = (product: PurchasePayloadProduct, index: number) => {
    setProductValue("productId", product.productId);
    setProductValue("quantity", product.quantity);
    setProductValue("price", product.price);
    setIsEditingProduct(true);
    setSelectedProductIndex(index); // Define o índice do produto a ser editado
    setModalOpen(true);
  };

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

  const total: number = calculateTotal();

  if (loadingPurchase) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

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

                {/* Fornecedor */}
                <Grid item xs={12}>
                  <Controller
                    name="personId"
                    control={control}
                    rules={{ required: "Fornecedor é obrigatório." }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={suppliers?.data || []}
                        loading={loadingSuppliers}
                        getOptionLabel={(option: SupplierBasicInfo) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.personId === value?.personId
                        }
                        value={
                          suppliers?.data.find(
                            (supplier) => supplier.personId === field.value
                          ) || null
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.personId : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Fornecedor"
                            variant="outlined"
                            error={!!errors.personId}
                            helperText={errors.personId?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loadingSuppliers ? (
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

                {/* Descrição */}
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

                {/* Nota Fiscal */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="NF-e"
                    placeholder="Nota Fiscal Eletrônica"
                    {...register("nfe", { maxLength: 15 })}
                    value={watch("nfe") || ""}
                    onChange={(e) => setValue("nfe", e.target.value)}
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
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    {...register("discount", {
                      setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
                    })}
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
                      resetModal(); // Resetar o formulário ao abrir o modal para adicionar
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
                              R$ {product.price}
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
                                size="small"
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
                    Atualizar Compra
                    {updatePurchase.isPending && (
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
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsEditingProduct(false);
          setSelectedProductIndex(null);
          resetModal(); // Resetar o formulário ao fechar o modal
        }}
      >
        <DialogTitle>
          {isEditingProduct ? "Editar Produto" : "Adicionar Produto"}
        </DialogTitle>
        <form onSubmit={handleModalSubmit(handleAddProduct)}>
          <DialogContent>
            {/* Produto */}
            <Controller
              name="productId"
              control={productControl}
              rules={{ required: "Produto é obrigatório." }}
              defaultValue={undefined}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={products?.data || []}
                  loading={loadingProducts}
                  getOptionLabel={(option: ProductBasicInfo) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.productId === value.productId
                  }
                  value={
                    products?.data.find((product) => product.productId === field.value) ||
                    null
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
                            {loadingProducts ? (
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
            {/* Quantidade */}
            <Controller
              name="quantity"
              control={productControl}
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
              control={productControl}
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
            <Button
              onClick={() => {
                setModalOpen(false);
                setIsEditingProduct(false);
                setSelectedProductIndex(null);
                resetModal(); // Resetar o formulário ao cancelar
              }}
            >
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
