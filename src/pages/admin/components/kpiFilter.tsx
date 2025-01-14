import type { KpiParams } from "src/models/kpiModel";

import React, { useState } from "react";

import {
    Box,
    Card,
    Grid,
    Button,
    MenuItem,
    TextField,
    Autocomplete
} from "@mui/material";

import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

import { TimeGranularity } from "src/models/kpiModel";

interface KpiFilterProps {
    setSalesKpiParams: React.Dispatch<React.SetStateAction<KpiParams>>;
    salesKpiParams: KpiParams;
}

type FilterOption = "specificPeriod" | "timePeriod" | "product" | "supplier";

const KpiFilter: React.FC<KpiFilterProps> = ({ setSalesKpiParams, salesKpiParams }) => {
    const [selectedFilter, setSelectedFilter] = useState<FilterOption | "">("");

    const { data: productsData, isLoading: isProductsLoading } = useGetProductsBasicInfo();
    const { data: suppliersData, isLoading: isSuppliersLoading } = useGetSuppliersBasicInfo();

    const suppliers = suppliersData?.data || [];
    const products = productsData?.data || [];

    const handleClearFilters = () => {
        setSalesKpiParams({});
        setSelectedFilter("");
    };

    return (
        <Grid container spacing={2} paddingBottom={5}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                    {/* Botões de Filtro e Limpar */}
                    <Box sx={{ marginBottom: 3, display: "flex", gap: 2, alignItems: "center" }}>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flexGrow: 1 }}>
                            <Button
                                variant={selectedFilter === "specificPeriod" ? "contained" : "outlined"}
                                onClick={() => setSelectedFilter("specificPeriod")}
                            >
                                Data Específica
                            </Button>
                            <Button
                                variant={selectedFilter === "timePeriod" ? "contained" : "outlined"}
                                onClick={() => setSelectedFilter("timePeriod")}
                            >
                                Período
                            </Button>
                            <Button
                                variant={selectedFilter === "product" ? "contained" : "outlined"}
                                onClick={() => setSelectedFilter("product")}
                            >
                                Produto
                            </Button>
                            <Button
                                variant={selectedFilter === "supplier" ? "contained" : "outlined"}
                                onClick={() => setSelectedFilter("supplier")}
                            >
                                Fornecedor
                            </Button>
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClearFilters}
                            disabled={!selectedFilter}
                        >
                            Limpar Filtros
                        </Button>
                    </Box>

                    {/* Filtros Dinâmicos */}
                    {selectedFilter === "specificPeriod" && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                        </Grid>
                    )}

                    {selectedFilter === "timePeriod" && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Período"
                                    value={salesKpiParams.period || ""}
                                    onChange={(e) =>
                                        setSalesKpiParams((prev) => ({
                                            ...prev,
                                            period: e.target.value as TimeGranularity,
                                        }))
                                    }
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione o Período
                                    </MenuItem>
                                    {Object.values(TimeGranularity).map((value) => (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    )}

                    {selectedFilter === "product" && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
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
                                        <TextField {...params} label="Produto" fullWidth />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {selectedFilter === "supplier" && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={suppliers}
                                    loading={isSuppliersLoading}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) =>
                                        option.supplierId === value.supplierId
                                    }
                                    value={
                                        suppliers.find(
                                            (supplier) => supplier.supplierId === salesKpiParams.supplierId
                                        ) || null
                                    }
                                    onChange={(_, newValue) =>
                                        setSalesKpiParams((prev) => {
                                            const updatedParams = { ...prev };
                                            if (newValue) {
                                                updatedParams.supplierId = newValue.supplierId;
                                            } else {
                                                delete updatedParams.supplierId;
                                            }
                                            return updatedParams;
                                        })}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Fornecedor" fullWidth />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}
                </Card>
            </Grid>
        </Grid>
    );
};


export default KpiFilter;
