import type { ProductBasicInfo } from 'src/models/product';
import type { SupplierBasicInfo } from 'src/models/supplier';
import { CreatePurchasePayload, PurchaseStatus } from "src/models/purchase";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

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

import { useCreatePurchase } from "src/hooks/usePurchase";
import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

// Função auxiliar para converter string com vírgula para número
const parseNumber = (value: string): number => {
    if (typeof value !== 'string') return 0;
    // Remove qualquer caractere que não seja dígito, ponto ou vírgula
    const cleanedValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    const parsed = parseFloat(cleanedValue);
    return Number.isNaN(parsed) ? 0 : parsed;
};

// Função auxiliar para formatar número para moeda brasileira
const formatCurrency = (value: number): string => 
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

// Defina um tipo separado para os dados do formulário
type CreatePurchaseFormData = Omit<CreatePurchasePayload, 'weightAmount' | 'price' | 'status'> & {
    weightAmount: string;
    price: string;
    date_time: string; // Manter como string no formulário
};

export default function CreatePurchasePage() {
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
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreatePurchaseFormData>({
        defaultValues: {
            weightAmount: '',
            price: '',
            supplierId: -1,
            productId: -1,
            description: '',
            date_time: undefined,
        }
    });

    const createPurchase = useCreatePurchase();
    const { data: products, isLoading: loadingProducts } = useGetProductsBasicInfo();
    const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
    const router = useRouter();
    const { addNotification } = useNotification();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile && uploadedFile.size <= 5 * 1024 * 1024) { // Limite de 5MB
            setFile(uploadedFile);
        } else {
            addNotification("Arquivo excede o limite de 5MB", "error");
        }
    };

    const onSubmit = (data: CreatePurchaseFormData) => {
        // Converte vírgula para ponto em weightAmount e price
        const parsedWeightAmount = parseNumber(data.weightAmount);
        const parsedPrice = parseNumber(data.price);

        const payload: CreatePurchasePayload = {
            ...data,
            weightAmount: parsedWeightAmount,
            price: parsedPrice,
            status: PurchaseStatus.processing, // Define um status padrão
            paymentSlip: file,
            date_time: new Date(data.date_time), // Converte string para Date
        };

        createPurchase.mutate(payload, {
            onSuccess: () => {
                addNotification("Compra criada com sucesso!", "success");
                router.push("/purchases");
            },
            onError: (error: any) => { // Ajuste o tipo de erro conforme sua implementação
                addNotification(`Erro ao criar compra: ${error.message}`, "error");
            },
        });
    };

    // Monitora os campos 'weightAmount' e 'price'
    const weightAmountValue = watch('weightAmount');
    const priceValue = watch('price');

    // Calcula o totalPrice usando useMemo para otimizar a performance
    const totalPrice = useMemo(() => {
        const weight = parseNumber(weightAmountValue || '0');
        const price = parseNumber(priceValue || '0');
        const total = weight * price;
        return Number.isNaN(total) || total <= 0 ? '' : formatCurrency(total);
    }, [weightAmountValue, priceValue]);

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
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={suppliers?.data || []}
                                        loading={loadingSuppliers}
                                        getOptionLabel={(option: SupplierBasicInfo) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.supplierId === value.supplierId
                                        }
                                        onChange={(_, newValue) =>
                                            setValue("supplierId", newValue ? newValue.supplierId : -1, {
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
                                            />
                                        )}
                                        renderOption={(props, option: SupplierBasicInfo) => (
                                            <li {...props} key={option.supplierId}>
                                                {option.name}
                                            </li>
                                        )}
                                    />
                                </Grid>

                                {/* Produto */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={products?.data || []}
                                        loading={loadingProducts}
                                        getOptionLabel={(option: ProductBasicInfo) => option.name}
                                        isOptionEqualToValue={(option, value) =>
                                            option.productId === value.productId
                                        }
                                        onChange={(_, newValue) =>
                                            setValue("productId", newValue ? newValue.productId : -1, {
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
                                            />
                                        )}
                                        renderOption={(props, option: ProductBasicInfo) => (
                                            <li {...props} key={option.productId}>
                                                {option.name}
                                            </li>
                                        )}
                                    />
                                </Grid>

                                {/* Quantidade (aceitando vírgula) */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade (Kilogramas)"
                                        placeholder="Digite a quantidade em kilogramas"
                                        type="text" // aceita vírgula
                                        {...register("weightAmount", {
                                            required: "A quantidade é obrigatória.",
                                            validate: {
                                                isPositive: (value) =>
                                                    parseNumber(value) >= 0.1 || "A quantidade mínima é 0,1 kilogramas.",
                                            },
                                        })}
                                        error={!!errors.weightAmount}
                                        helperText={errors.weightAmount?.message}
                                    />
                                </Grid>

                                {/* Preço (aceitando vírgula) */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço (R$)"
                                        placeholder="Digite o preço"
                                        type="text" // aceita vírgula
                                        {...register("price", {
                                            required: "O preço é obrigatório.",
                                            validate: {
                                                isNonNegative: (value) =>
                                                    parseNumber(value) >= 0 || "O preço não pode ser negativo.",
                                            },
                                        })}
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                    />
                                </Grid>

                                {/* Preço Total */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço Total (R$)"
                                        value={totalPrice}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        helperText="Preço total calculado automaticamente."
                                    />
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
