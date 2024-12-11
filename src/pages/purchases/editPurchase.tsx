import type { CreatePurchasePayload } from "src/models/purchase";

import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

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
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";
import { useUpdatePurchase, useGetPurchaseById } from "src/hooks/usePurchase";

import { CONFIG } from "src/config-global";
import { PurchaseStatus } from "src/models/purchase";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function EditPurchasePage() {
    const { id } = useParams<{ id: string }>();
    const purchaseId = Number(id);

    const formStyle = {
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
    };

    const [file, setFile] = useState<Blob | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreatePurchasePayload>();
    const { data: purchase, isLoading: loadingPurchase } = useGetPurchaseById(purchaseId);
    const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
    const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
    const updatePurchase = useUpdatePurchase();
    const router = useRouter();
    const { addNotification } = useNotification();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile && uploadedFile.size <= 5 * 1024 * 1024) {
            setFile(uploadedFile);
        } else {
            addNotification("Arquivo excede o limite de 5MB", "error");
        }
    };

    useEffect(() => {
        if (purchase) {
            setValue("supplierId", purchase.supplierId);
            setValue("productId", purchase.productId);
            setValue("weightAmount", purchase.product?.weightAmount || 0);
            setValue("price", purchase.product?.price || 0);
            setValue("status", purchase.purchaseStatus);
            setValue("description", purchase.description || "");
            setValue("date_time", purchase.date_time);
        }
    }, [purchase, setValue]);

    const onSubmit = (data: CreatePurchasePayload) => {
        const payload: CreatePurchasePayload = {
            ...data,
            paymentSlip: file,
        };

        updatePurchase.mutate(
            { id: purchaseId, data: payload },
            {
                onSuccess: () => {
                    addNotification("Compra atualizada com sucesso!", "success");
                    router.push("/purchases");
                },
                onError: (error) => {
                    addNotification(`Erro ao atualizar compra: ${error.message}`, "error");
                },
            }
        );
    };

    if (loadingPurchase) {
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
                <title>{`Editar Compra - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={formStyle}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Editar Compra
                                    </Typography>
                                </Grid>

                                {/* Fornecedor */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="supplier-label">Fornecedor</InputLabel>
                                        <Select
                                            labelId="supplier-label"
                                            label="Fornecedor"
                                            defaultValue={purchase?.supplierId}
                                            {...register("supplierId", { required: "Selecione um fornecedor." })}
                                        >
                                            {loadingSuppliers ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={20} />
                                                </MenuItem>
                                            ) : (
                                                suppliers?.data.map((supplier) => (
                                                    <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                                                        {supplier.name}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {errors.supplierId && (
                                            <Typography variant="body2" color="error">
                                                {errors.supplierId.message}
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
                                            defaultValue={purchase?.productId}
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

                                {/* Quantidade e Preço */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade (Kg)"
                                        type="number"
                                        {...register("weightAmount", { required: "Digite a quantidade.", min: 0 })}
                                        error={!!errors.weightAmount}
                                        helperText={errors.weightAmount?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço (R$)"
                                        type="number"
                                        {...register("price", { required: "Digite o preço.", min: 0 })}
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                    />
                                </Grid>

                                {/* Status */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            defaultValue=""
                                            {...register("status", { required: "Selecione um status." })}
                                        >
                                            <MenuItem value={PurchaseStatus.processing}>
                                                <span style={{ color: "yellow" }}>●</span> Pendente
                                            </MenuItem>
                                            <MenuItem value={PurchaseStatus.approved}>
                                                <span style={{ color: "green" }}>●</span> Aprovado
                                            </MenuItem>
                                            <MenuItem value={PurchaseStatus.canceled}>
                                                <span style={{ color: "red" }}>●</span> Cancelado
                                            </MenuItem>
                                        </Select>
                                        {errors.status && (
                                            <Typography variant="body2" color="error">
                                                {errors.status.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Descrição */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descrição"
                                        multiline
                                        rows={4}
                                        {...register("description")}
                                    />
                                </Grid>

                                {/* Data da Compra */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Data da Compra"
                                        type="date"
                                        value={purchase?.date_time ? new Date(purchase.date_time).toISOString().split('T')[0] : ''}
                                        InputLabelProps={{ shrink: true }}
                                        {...register("date_time", { required: "Selecione uma data." })}
                                        error={!!errors.date_time}
                                        helperText={errors.date_time?.message}
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

                                    {purchase?.paymentSlip && (
                                        <Grid item xs={12} sx={{ mt: 2 }}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                onClick={() => {
                                                    if (purchase?.paymentSlip?.data) {
                                                        const blob = new Blob([Uint8Array.from(purchase?.paymentSlip.data)], {
                                                            type: "application/pdf", // Altere o tipo, se necessário
                                                        });
                                                        const blobUrl = URL.createObjectURL(blob);
                                                        window.open(blobUrl, "_blank");
                                                    }
                                                }}
                                            >
                                                Exibir Arquivo Atual
                                            </Button>
                                        </Grid>
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
                                        disabled={updatePurchase.isPending}
                                    >
                                        Atualizar
                                        {updatePurchase.isPending && (
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
