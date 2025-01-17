// src/components/FluxoCaixaMensalComponent.tsx

import type {
  SelectChangeEvent
} from "@mui/material";

import React, { useState } from "react";

import {
  Box,
  Table,
  Alert,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  InputLabel,
  Typography,
  FormControl,
  LinearProgress
} from "@mui/material";

import { useGetFluxoCaixaMensal } from "src/hooks/useKpi";

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

export default function FluxoCaixaMensalComponent() {
  // Estado para o ano selecionado
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Hook para buscar os dados do fluxo de caixa mensal
  const { data, isLoading, isError, error } = useGetFluxoCaixaMensal(selectedYear);

  // Lista de anos para seleção (exemplo: últimos 10 anos)
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Função de manipulação de mudança de ano
  const handleYearChange = (event: SelectChangeEvent<string>) => {
    const year = Number(event.target.value);
    if (year) {
      setSelectedYear(year);
    } else {
      console.error("Ano selecionado inválido:", event.target.value);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fluxo de Caixa Mensal
      </Typography>

      {/* Seletor de Ano */}
      <FormControl sx={{ minWidth: 120, mb: 3 }}>
        <InputLabel id="select-year-label">Ano</InputLabel>
        <Select
          labelId="select-year-label"
          id="select-year"
          value={selectedYear.toString()} // Converter para string
          label="Ano"
          onChange={handleYearChange} // Usar a função com tipo correto
        >
          {years.map((year) => (
            <MenuItem key={year} value={year.toString()}> {/* Definir valor como string */}
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Indicador de Carregamento */}
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Mensagem de Erro */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error
            ? `Erro ao carregar os dados: ${error.message}`
            : "Erro desconhecido ao carregar os dados."}
        </Alert>
      )}

      {/* Tabela de Fluxo de Caixa Mensal */}
      {data && Array.isArray(data.data.months) && data.data.months.length > 0 ? (
        <Box>
          {/* Resumo Anual */}
          <Typography variant="h6" gutterBottom>
            Resumo Anual
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>A Receber</TableCell>
                <TableCell>A Pagar</TableCell>
                <TableCell>Saldo Projetado</TableCell>
                <TableCell>Total A Receber Pagos</TableCell>
                <TableCell>Total A Pagar Pagos</TableCell>
                <TableCell>Saldo Realizado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{formatCurrency(data.data.totalProjectedReceivables)}</TableCell>
                <TableCell>{formatCurrency(data.data.totalProjectedPayables)}</TableCell>
                <TableCell>{formatCurrency(data.data.projectedBalance)}</TableCell>
                <TableCell>{formatCurrency(data.data.totalPaidReceivables)}</TableCell>
                <TableCell>{formatCurrency(data.data.totalPaidPayables)}</TableCell>
                <TableCell>{formatCurrency(data.data.paidBalance)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Espaçamento */}
          <Box sx={{ my: 4 }} />

          {/* Detalhamento por Mês */}
          <Typography variant="h6" gutterBottom>
            Detalhamento Mensal
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mês</TableCell>
                <TableCell>A Receber</TableCell>
                <TableCell>Total Pagos</TableCell>
                <TableCell>A Pagar</TableCell>
                <TableCell>Total Pagos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {data.data.months.map((month, index) => (
                <TableRow
                  key={month.month}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "grey.100" : "grey.50", // Alterna entre tons de cinza
                  }}
                >
                  <TableCell>{getMonthName(month.month)}</TableCell>
                  <TableCell>{formatCurrency(month.totalReceivables)}</TableCell>
                  <TableCell>{formatCurrency(month.totalReceived)}</TableCell>
                  <TableCell>{formatCurrency(month.totalPayables)}</TableCell>
                  <TableCell>{formatCurrency(month.totalPaid)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        !isLoading && !isError && (
          <Typography>Nenhum dado disponível para o ano selecionado.</Typography>
        )
      )}
    </Box>
  );
}
