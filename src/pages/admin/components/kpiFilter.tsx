import type { SalesKpiParams } from "src/models/salesKpiModel";

import React from "react";

import {
    Box,
    Card,
    Grid,
    Button,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
} from "@mui/material";

import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

import { StackBy, TimeGranularity } from "src/models/salesKpiModel";

interface KpiFilterProps {
    setSalesKpiParams: React.Dispatch<React.SetStateAction<SalesKpiParams>>;
    salesKpiParams: SalesKpiParams;
}

const KpiFilter: React.FC<KpiFilterProps> = ({ setSalesKpiParams, salesKpiParams }) => {
    const { data: productsData, isLoading: isProductsLoading } = useGetProductsBasicInfo();
    const { data: suppliersData, isLoading: isSuppliersLoading } = useGetSuppliersBasicInfo();

    const products = productsData?.data || []; // Corrigido para acessar a propriedade "data"
    const suppliers = suppliersData?.data || []; // Corrigido para acessar a propriedade "data"

    const isFilterActive = Object.values(salesKpiParams).some(
        (value) => value !== undefined && value !== null && value !== ""
    );

    const handleClearFilters = () => {
        setSalesKpiParams({});
    };

    return (
        <Grid container spacing={2} paddingBottom={5}>
            <Grid item xs={12} md={12}>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                    {/* Botão alinhado à direita */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end", // Alinha o botão à direita
                            marginBottom: 3,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClearFilters}
                            disabled={!isFilterActive}
                            sx={{
                                width: { xs: "100%", sm: "150px" },
                                height: "56px",
                            }}
                        >
                            Limpar Filtros
                        </Button>
                    </Box>

                    {/* Campos de Filtros */}
                    <Grid container spacing={2}>
                        {/* Data Inicial */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Data Inicial"
                                type="date"
                                value={salesKpiParams.startDate || ""}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(e) =>
                                    setSalesKpiParams((prev) => ({
                                        ...prev,
                                        startDate: e.target.value,
                                    }))
                                }
                            />
                        </Grid>

                        {/* Data Final */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Data Final"
                                type="date"
                                value={salesKpiParams.endDate || ""}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(e) =>
                                    setSalesKpiParams((prev) => ({
                                        ...prev,
                                        endDate: e.target.value,
                                    }))
                                }
                            />
                        </Grid>

                        {/* Produto */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                disabled={salesKpiParams.supplierId != null}
                                options={products}
                                loading={isProductsLoading}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                    option.productId === value.productId
                                }
                                value={
                                    products.find(
                                        (product) => product.productId === salesKpiParams.productId
                                    ) || null
                                }
                                onChange={(_, newValue) =>
                                    setSalesKpiParams((prev) => ({
                                        ...prev,
                                        productId: newValue?.productId || undefined,
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Produto"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.productId}>
                                        {option.name}
                                    </li>
                                )}
                            />

                        </Grid>

                        {/* Fornecedor */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                disabled={salesKpiParams.productId != null}
                                options={suppliers}
                                loading={isSuppliersLoading}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                    option.supplierId === value.supplierId
                                }
                                value={
                                    suppliers.find(
                                        (supplier) =>
                                            supplier.supplierId === salesKpiParams.supplierId
                                    ) || null
                                }
                                onChange={(_, newValue) =>
                                    setSalesKpiParams((prev) => ({
                                        ...prev,
                                        supplierId: newValue?.supplierId || undefined,
                                    }))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Fornecedor"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.supplierId}>
                                        {option.name}
                                    </li>
                                )}
                            />

                        </Grid>

                        {/* Período */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Select
                                value={salesKpiParams.period || ""}
                                onChange={(e) =>
                                    setSalesKpiParams((prev) => ({
                                        ...prev,
                                        period: e.target.value ? (e.target.value as TimeGranularity) : undefined,
                                    }))
                                }
                                displayEmpty
                                fullWidth
                            >
                                {/* Placeholder */}
                                <MenuItem value="" disabled>
                                    Período
                                </MenuItem>

                                {/* Opções */}
                                {Object.values(TimeGranularity).map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>


                        {/* Agrupar por */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Select
                                value={salesKpiParams.stackBy || ""}
                                onChange={(e) =>
                                    setSalesKpiParams((prev) => ({
                                        ...prev,
                                        stackBy: e.target.value as StackBy,
                                    }))
                                }
                                displayEmpty
                                fullWidth
                            >
                                <MenuItem value="" disabled>
                                    Agrupar por
                                </MenuItem>
                                {Object.values(StackBy).map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
};

export default KpiFilter;
