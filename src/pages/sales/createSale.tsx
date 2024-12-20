import type { CreateSalePayload } from "src/models/sale";

import React from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import {
    Box,
    Grid,
    Button,
    Select,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    FormControl,
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

    const { register, handleSubmit, formState: { errors } } = useForm<CreateSalePayload>();
    const createSale = useCreateSale();
    const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
    const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();
    const router = useRouter();
    const { addNotification } = useNotification();

    const onSubmit = (data: CreateSalePayload) => {
        createSale.mutate(data, {
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
                                <Grid item xs={6}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Criar Venda
                                    </Typography>
                                </Grid>

                                {/* Cliente */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="customer-label">Cliente</InputLabel>
                                        <Select
                                            labelId="customer-label"
                                            label="Cliente"
                                            defaultValue=""
                                            {...register("customerId", { required: "Selecione um cliente." })}
                                        >
                                            {loadingCustomers ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={20} />
                                                </MenuItem>
                                            ) : (
                                                customers?.data.map((customer) => (
                                                    <MenuItem key={customer.customerId} value={customer.customerId}>
                                                        {customer.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.customerId && (
                                            <Typography variant="body2" color="error">
                                                {errors.customerId.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Produto */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="product-label">Produto</InputLabel>
                                        <Select
                                            labelId="product-label"
                                            label="Produto"
                                            defaultValue=""
                                            {...register("productId", { required: "Selecione um produto." })}
                                        >
                                            {loadingProducts ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={20} />
                                                </MenuItem>
                                            ) : (
                                                products?.data.map((product) => (
                                                    <MenuItem key={product.productId} value={product.productId}>
                                                        {product.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.productId && (
                                            <Typography variant="body2" color="error">
                                                {errors.productId.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Quantidade */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade"
                                        placeholder="Digite a quantidade"
                                        type="number"
                                        {...register("quantity", { required: "A quantidade é obrigatória.", min: 1 })}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity?.message}
                                    />
                                </Grid>

                                {/* Preço Total */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço Total (R$)"
                                        placeholder="Digite o preço total"
                                        type="number"
                                        {...register("totalPrice", { required: "O preço total é obrigatório.", min: 0 })}
                                        error={!!errors.totalPrice}
                                        helperText={errors.totalPrice?.message}
                                    />
                                </Grid>

                                {/* Status */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            defaultValue=""
                                            {...register("saleStatus", { required: "Selecione um status." })}
                                        >
                                            <MenuItem value="pending">Pendente</MenuItem>
                                            <MenuItem value="completed">Concluído</MenuItem>
                                            <MenuItem value="canceled">Cancelado</MenuItem>
                                        </Select>
                                        {errors.saleStatus && (
                                            <Typography variant="body2" color="error">
                                                {errors.saleStatus.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Data da Venda */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Data da Venda"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        {...register("date_time", { required: "Selecione uma data de venda." })}
                                        error={!!errors.date_time}
                                        helperText={errors.date_time?.message}
                                    />
                                </Grid>

                                {/* Botão de Enviar */}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={createSale.isPending}
                                    >
                                        Enviar
                                        {createSale.isPending && (
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
    );
}
