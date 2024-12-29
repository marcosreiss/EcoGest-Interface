import type { CreatePurchasePayload } from "src/models/purchase";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import Autocomplete from "@mui/material/Autocomplete";
import {
    Box,
    Grid,
    Button,
    MenuItem,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreatePurchase } from "src/hooks/usePurchase";
import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

import { CONFIG } from "src/config-global";
import { PurchaseStatus } from 'src/models/purchase';
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function CreatePurchasePage() {
    const formStyle = {
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
    };

    const [file, setFile] = useState<Blob | null>(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreatePurchasePayload>();
    const createPurchase = useCreatePurchase();
    const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
    const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
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

    const onSubmit = (data: CreatePurchasePayload) => {
        const payload: CreatePurchasePayload = {
            ...data,
            paymentSlip: file,
        };
        console.log(payload);

        createPurchase.mutate(payload, {
            onSuccess: () => {
                addNotification("Compra criada com sucesso!", "success");
                router.push("/purchases");
            },
            onError: (error) => {
                addNotification(`Erro ao criar compra: ${error.message}`, "error");
            },
        });
    };

    return (
        <>
            <Helmet>
                <title>{`Criar Compra - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent maxWidth="md">
                <Grid container>
                    <Grid item xs={12}>
                        <Box sx={formStyle}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                                        Criar Compra
                                    </Typography>
                                </Grid>

                                {/* Fornecedor */}
                                <Grid item xs={12} sm={6} md={12}>
                                    <Autocomplete
                                        options={suppliers?.data || []}
                                        loading={loadingSuppliers}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.supplierId === value.supplierId
                                        }
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
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.supplierId}>
                                                {option.name}
                                            </li>
                                        )}
                                    />
                                </Grid>

                                {/* Produto */}
                                <Grid item xs={12} sm={6} md={12}>
                                    <Autocomplete
                                        options={products?.data || []}
                                        loading={loadingProducts}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.productId === value.productId
                                        }
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
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.productId}>
                                                {option.name}
                                            </li>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade (Kg)"
                                        placeholder="Digite a quantidade em Kg"
                                        type="number"
                                        {...register("weightAmount", { required: "A quantidade é obrigatória.", min: 0 })}
                                        error={!!errors.weightAmount}
                                        helperText={errors.weightAmount?.message}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço (R$)"
                                        placeholder="Digite o preço"
                                        type="number"
                                        {...register("price", { required: "O preço é obrigatório.", min: 0 })}
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
                                        defaultValue=""
                                        {...register("status", { required: "Selecione um status." })}
                                        error={!!errors.status}
                                        helperText={errors.status?.message}
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
                                    </TextField>
                                </Grid>

                                {/* Descrição */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descrição"
                                        placeholder="Descrição da compra"
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
                                        InputLabelProps={{ shrink: true }}
                                        {...register("date_time", { required: "Selecione uma data de compra." })}
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
                                        disabled={createPurchase.isPending}
                                    >
                                        Enviar
                                        {createPurchase.isPending && (
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
