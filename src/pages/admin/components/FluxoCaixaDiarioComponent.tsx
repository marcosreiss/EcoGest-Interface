// src/components/FluxoCaixaDiarioComponent.tsx

import type { SelectChangeEvent } from "@mui/material";

import React, { useState } from "react";

import {
    Box,
    Grid,
    Alert,
    Table,
    Select,
    MenuItem,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    InputLabel,
    Typography,
    FormControl,
    LinearProgress
} from "@mui/material";

import { useGetFluxoCaixaDiario } from "src/hooks/useKpi";
import { useGetProductsBasicInfo } from "src/hooks/useProduct";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

// Função para mapear número do mês para nome em português
const getMonthName = (monthNumber: number): string => {
    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];
    return monthNames[monthNumber - 1] || "-";
};

// Função para formatar valores monetários
const formatCurrency = (value?: number): string => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default function FluxoCaixaDiarioComponent() {
    // Estados para os filtros
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Mês atual
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | "all">("all");
    const [selectedProductId, setSelectedProductId] = useState<number | "all">("all");

    // Hooks para buscar fornecedores e produtos
    const {
        data: suppliersData,
        isLoading: isLoadingSuppliers,
        isError: isErrorSuppliers,
        error: errorSuppliers,
    } = useGetSuppliersBasicInfo();

    const {
        data: productsData,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: errorProducts,
    } = useGetProductsBasicInfo();

    // Hook para buscar fluxo de caixa diário
    const {
        data: fluxoCaixaDiario,
        isLoading: isLoadingFluxoCaixaDiario,
        isError: isErrorFluxoCaixaDiario,
        error: errorFluxoCaixaDiario,
    } = useGetFluxoCaixaDiario(
        selectedYear,
        selectedMonth,
        selectedSupplierId === "all" ? undefined : selectedSupplierId,
        selectedProductId === "all" ? undefined : selectedProductId
    );

    // Lista de anos para seleção (exemplo: últimos 10 anos)
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    // Lista de meses
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Funções de manipulação de mudança nos selects
    const handleYearChange = (event: SelectChangeEvent<string>) => {
        const year = Number(event.target.value);
        if (year) {
            setSelectedYear(year);
        } else {
            console.error("Ano selecionado inválido:", event.target.value);
        }
    };

    const handleMonthChange = (event: SelectChangeEvent<string>) => {
        const month = Number(event.target.value);
        if (month >= 1 && month <= 12) {
            setSelectedMonth(month);
        } else {
            console.error("Mês selecionado inválido:", event.target.value);
        }
    };

    const handleSupplierChange = (event: SelectChangeEvent<string>) => {
        const { value } = event.target;
        if (value === "all") {
            setSelectedSupplierId("all");
        } else {
            const supplierId = Number(value);
            if (supplierId) {
                setSelectedSupplierId(supplierId);
            } else {
                console.error("Fornecedor selecionado inválido:", value);
            }
        }
    };

    const handleProductChange = (event: SelectChangeEvent<string>) => {
        const { value } = event.target;
        if (value === "all") {
            setSelectedProductId("all");
        } else {
            const productId = Number(value);
            if (productId) {
                setSelectedProductId(productId);
            } else {
                console.error("Produto selecionado inválido:", value);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Fluxo de Caixa Diário
            </Typography>

            {/* Filtros */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    {/* Seletor de Ano */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="select-year-label">Ano</InputLabel>
                            <Select
                                labelId="select-year-label"
                                id="select-year"
                                value={selectedYear.toString()} // Converter para string
                                label="Ano"
                                onChange={handleYearChange}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year.toString()}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Seletor de Mês */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="select-month-label">Mês</InputLabel>
                            <Select
                                labelId="select-month-label"
                                id="select-month"
                                value={selectedMonth.toString()} // Converter para string
                                label="Mês"
                                onChange={handleMonthChange}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month} value={month.toString()}>
                                        {getMonthName(month)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Seletor de Fornecedor */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="select-supplier-label">Fornecedor</InputLabel>
                            <Select
                                labelId="select-supplier-label"
                                id="select-supplier"
                                value={selectedSupplierId === "all" ? "all" : selectedSupplierId.toString()}
                                label="Fornecedor"
                                onChange={handleSupplierChange}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                {suppliersData &&
                                    suppliersData.data.map((supplier) => (
                                        <MenuItem key={supplier.personId} value={supplier.personId.toString()}>
                                            {supplier.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Seletor de Produto */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="select-product-label">Produto</InputLabel>
                            <Select
                                labelId="select-product-label"
                                id="select-product"
                                value={selectedProductId === "all" ? "all" : selectedProductId.toString()}
                                label="Produto"
                                onChange={handleProductChange}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                {productsData &&
                                    productsData.data.map((product) => (
                                        <MenuItem key={product.productId} value={product.productId.toString()}>
                                            {product.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Indicador de Carregamento */}
            {(isLoadingSuppliers || isLoadingProducts || isLoadingFluxoCaixaDiario) && (
                <LinearProgress sx={{ mb: 3 }} />
            )}

            {/* Mensagem de Erro */}
            {(isErrorSuppliers || isErrorProducts || isErrorFluxoCaixaDiario) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {isErrorSuppliers && errorSuppliers instanceof Error
                        ? `Erro ao carregar fornecedores: ${errorSuppliers.message}`
                        : isErrorProducts && errorProducts instanceof Error
                            ? `Erro ao carregar produtos: ${errorProducts.message}`
                            : isErrorFluxoCaixaDiario && errorFluxoCaixaDiario instanceof Error
                                ? `Erro ao carregar fluxo de caixa diário: ${errorFluxoCaixaDiario.message}`
                                : "Erro desconhecido ao carregar os dados."}
                </Alert>
            )}

            {/* Tabela de Fluxo de Caixa Diário */}
            {fluxoCaixaDiario && fluxoCaixaDiario.data && Array.isArray(fluxoCaixaDiario.data.days) && fluxoCaixaDiario.data.days.length > 0 ? (
                <Box>
                    {/* Resumo Anual */}
                    <Typography variant="h6" gutterBottom>
                        Resumo Anual
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Total A Receber</TableCell>
                                <TableCell>Total A Pagar</TableCell>
                                <TableCell>Saldo Projetado</TableCell>
                                <TableCell>Total A Receber Pagos</TableCell>
                                <TableCell>Total A Pagar Pagos</TableCell>
                                <TableCell>Saldo Realizado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{formatCurrency(fluxoCaixaDiario.data.totalProjectedReceivables)}</TableCell>
                                <TableCell>{formatCurrency(fluxoCaixaDiario.data.totalProjectedPayables)}</TableCell>
                                <TableCell>{formatCurrency(fluxoCaixaDiario.data.projectedBalance)}</TableCell>
                                <TableCell>{formatCurrency(fluxoCaixaDiario.data.totalPaidReceivables)}</TableCell>
                                <TableCell>{formatCurrency(fluxoCaixaDiario.data.totalPaidPayables)}</TableCell>
                                <TableCell>{formatCurrency(fluxoCaixaDiario.data.finalBalance)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {/* Espaçamento */}
                    <Box sx={{ my: 4 }} />

                    {/* Detalhamento por Dia */}
                    <Typography variant="h6" gutterBottom>
                        Detalhamento Diário
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Dia</TableCell>
                                <TableCell>A Receber</TableCell>
                                <TableCell>A Receber Pagos</TableCell>
                                <TableCell>A Pagar</TableCell>
                                <TableCell>A Pagar Pagos</TableCell>
                                <TableCell>Saldo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fluxoCaixaDiario.data.days.map((day, index) => (
                                <TableRow
                                    key={day.day}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "grey.100" : "grey.50", // Alterna entre tons de cinza
                                    }}
                                >
                                    <TableCell>{day.day}</TableCell>
                                    <TableCell>{formatCurrency(day.totalReceivables)}</TableCell>
                                    <TableCell>{formatCurrency(day.totalReceived)}</TableCell>
                                    <TableCell>{formatCurrency(day.totalPayables)}</TableCell>
                                    <TableCell>{formatCurrency(day.totalPaid)}</TableCell>
                                    <TableCell>{formatCurrency(day.balance)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            ) : (
                !isLoadingFluxoCaixaDiario &&
                !isErrorFluxoCaixaDiario && (
                    <Typography>Nenhum dado disponível para os filtros selecionados.</Typography>
                )
            )}
        </Box>
    );
}
