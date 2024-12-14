import type { CreateSalePayload } from "src/models/sale";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

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

import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetCustomersBasicInfo } from "src/hooks/useCustomer";
import { useUpdateSale, useGetSaleById } from "src/hooks/useSales";

import { CONFIG } from "src/config-global";
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

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateSalePayload>();
    const { data: sale, isLoading: loadingSale } = useGetSaleById(saleId);
    const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
    const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();
    const updateSale = useUpdateSale();
    const router = useRouter();
    const { addNotification } = useNotification();

    useEffect(() => {
        if (sale) {
            setValue("customerId", sale.customerId);
            setValue("productId", sale.productId);
            setValue("quantity", sale.quantity);
            setValue("totalPrice", sale.totalPrice);
            setValue("saleStatus", sale.saleStatus);
            setValue("date_time", sale.date_time);
        }
    }, [sale, setValue]);

    const onSubmit = (data: CreateSalePayload) => {
        updateSale.mutate(
            { id: saleId, data },
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

    if (loadingSale) {
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
                <title>{`Editar Venda - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={formStyle}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Editar Venda
                                    </Typography>
                                </Grid>

                                {/* Cliente */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="customer-label">Cliente</InputLabel>
                                        <Select
                                            labelId="customer-label"
                                            label="Cliente"
                                            defaultValue={sale?.customerId}
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
                                            defaultValue={sale?.productId}
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
                                        type="number"
                                        {...register("quantity", { required: "Digite a quantidade.", min: 1 })}
                                        error={!!errors.quantity}
                                        helperText={errors.quantity?.message}
                                    />
                                </Grid>

                                {/* Preço Total */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço Total (R$)"
                                        type="number"
                                        {...register("totalPrice", { required: "Digite o preço total.", min: 0 })}
                                        error={!!errors.totalPrice}
                                        helperText={errors.totalPrice?.message}
                                    />
                                </Grid>

                                {/* Status */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            defaultValue={sale?.saleStatus}
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
                                        value={sale?.date_time ? sale.date_time.split("T")[0] : ''}
                                        InputLabelProps={{ shrink: true }}
                                        {...register("date_time", { required: "Selecione uma data." })}
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
                                        disabled={updateSale.isPending}
                                    >
                                        Atualizar
                                        {updateSale.isPending && (
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
