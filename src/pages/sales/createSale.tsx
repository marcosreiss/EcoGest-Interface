import type { AxiosError } from "axios";
import type { PersonBasicInfo } from "src/models/person";
import type { ProductBasicInfo } from "src/models/product";
import type { ApiErrorResponse } from "src/models/errorResponse";
import type { SalePayload, SaleProductPayload } from "src/models/sale";

import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
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

  // Estado para gerenciar a lista de produtos na venda
  const [productsList, setProductsList] = useState<SaleProductPayload[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);

  // Formulário principal para criar a venda
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SalePayload>({
    defaultValues: {
      discount: 0,
    },
  });

  // Formulário do modal para adicionar/editar produtos
  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    reset: resetModal,
    formState: { errors: modalErrors },
    setValue: setProductValue,
  } = useForm<SaleProductPayload>();

  const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const createSale = useCreateSale();

  // Função para calcular o total da venda
  const calculateTotal = (): number => {
    const total = productsList.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    const discount = parseFloat(String(watch("discount")) || "0");
    return Math.max(total - discount, 0); // Evita valores negativos
  };

  // Função para adicionar ou editar um produto na venda
  const handleAddProduct = (data: SaleProductPayload) => {
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

  // Função para lidar com o clique no botão de editar produto
  const handleEditProductClick = (product: SaleProductPayload, index: number) => {
    setProductValue("productId", product.productId);
    setProductValue("quantity", product.quantity);
    setProductValue("price", product.price);
    setIsEditingProduct(true);
    setSelectedProductIndex(index);
    setModalOpen(true);
  };

  // Função para remover um produto da venda
  const handleRemoveProduct = () => {
    if (selectedProductIndex !== null) {
      setProductsList(productsList.filter((_, index) => index !== selectedProductIndex));
      setSelectedProductIndex(null);
      setConfirmDialogOpen(false);
    }
  };

  // Função para submissão do formulário principal
  const onSubmit = (data: SalePayload) => {
    const payload: SalePayload = {
      ...data,
      discount: data.discount || 0, // Garantir que o desconto seja 0 se não definido
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

                {/* Cliente */}
                <Grid item xs={12}>
                  <Controller
                    name="personId"
                    control={control}
                    rules={{ required: "Cliente é obrigatório." }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
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
                    {...register("discount", { setValueAs: (v) => (v === "" ? 0 : parseFloat(v)) })}
                  />
                </Grid>

                {/* Produtos */}
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
                          <TableCell style={{ padding: "6px", fontSize: "0.9rem" }}>Subtotal</TableCell>
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
                              R$ {(product.price * product.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell style={{ padding: "6px", fontSize: "0.85rem" }}>
                              <IconButton
                                color="info"
                                onClick={() => handleEditProductClick(product, index)}
                                size="small"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
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
              control={modalControl}
              rules={{ required: "Produto é obrigatório." }}
              defaultValue={undefined}
              render={({ field }) => (
                <Autocomplete
                  {...field}
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
                  disabled={isEditingProduct} // Desabilitar seleção de produto ao editar
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

            {/* Quantidade */}
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

            {/* Preço */}
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
    </>
  );
}