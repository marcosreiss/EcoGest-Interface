import type { CreatePurchasePayload } from "src/models/purchase";

import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography,
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

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreatePurchasePayload>();
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
            setValue("weightAmount", purchase.weightAmount || 0);
            setValue("price", purchase.price || 0);
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
                                <Grid item xs={12}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Editar Compra
                                    </Typography>
                                </Grid>

                                {/* Fornecedor */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={suppliers?.data || []}
                                        loading={loadingSuppliers}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.supplierId === value.supplierId
                                        }
                                        defaultValue={suppliers?.data.find(
                                            (supplier) => supplier.supplierId === purchase?.supplierId
                                        )}
                                        onChange={(_, newValue) =>
                                            setValue("supplierId", newValue?.supplierId || -1, {
                                                shouldValidate: true,
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Fornecedor"
                                                variant="outlined"
                                                error={!!errors.supplierId}
                                                helperText={errors.supplierId?.message}
                                                {...register("supplierId", { required: "Selecione um fornecedor." })}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Produto */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={products?.data || []}
                                        loading={loadingProducts}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.productId === value.productId
                                        }
                                        defaultValue={products?.data.find(
                                            (product) => product.productId === purchase?.productId
                                        )}
                                        onChange={(_, newValue) =>
                                            setValue("productId", newValue?.productId || -1, {
                                                shouldValidate: true,
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Produto"
                                                variant="outlined"
                                                error={!!errors.productId}
                                                helperText={errors.productId?.message}
                                                {...register("productId", { required: "Selecione um produto." })}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Quantidade e Preço */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade (Toneladas)"
                                        type="number"
                                        {...register("weightAmount", { 
                                            required: "Digite a quantidade.", 
                                            min: {
                                                value: 0.1,
                                                message: "A quantidade mínima é 0.1 tonelada."
                                            }
                                        })}
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
                                    <TextField
                                        select
                                        label="Status"
                                        fullWidth
                                        defaultValue={purchase?.purchaseStatus || ""}
                                        {...register("status", { required: "Selecione um status." })}
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
                                    >
                                        <option value={PurchaseStatus.processing}>Pendente</option>
                                        <option value={PurchaseStatus.approved}>Aprovado</option>
                                        <option value={PurchaseStatus.canceled}>Cancelado</option>
                                    </TextField>
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
                                        value={
                                            purchase?.date_time
                                                ? new Date(purchase.date_time).toISOString().split("T")[0]
                                                : ""
                                        }
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
