import type { KpiParams } from 'src/models/kpiModel';
// import type { TotalExpensesData } from 'src/models/ExpensesKpiRespnse';
// import type { TotalSalesApprovedData } from 'src/models/salesKpiResponse';

import React, { useState } from 'react';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  Box,
  Card,
  Grid,
  Stack,
  Tooltip,
  Typography,
  CardContent,
} from '@mui/material';

// import { TimeGranularity } from 'src/models/kpiModel';

interface FinancialOverviewCardProps {
  totalBalance: number;
  income: number;
  incomeChangePercentage: number;
  expenses: number;
  expenseChangePercentage: number;
  // salesData: TotalSalesApprovedData[];
  // expensesData: TotalExpensesData[];
  setSalesKpiParams: React.Dispatch<React.SetStateAction<KpiParams>>;
}

const FinancialOverviewCard: React.FC<FinancialOverviewCardProps> = ({
  totalBalance,
  income,
  incomeChangePercentage,
  expenses,
  expenseChangePercentage,
  // salesData,
  // expensesData,
  setSalesKpiParams
}) => {

  // const [selectedPeriod, setSelectedPeriod] = useState<TimeGranularity>(TimeGranularity.Month);
  const [dataType, setDataType] = useState<'Income' | 'Expenses'>('Income');

  // const handlePeriodChange = (period: TimeGranularity) => {
  //   setSelectedPeriod(period);
  //   setSalesKpiParams((prevParams) => ({ ...prevParams, period }));
  // };


  const handleDataTypeClick = (type: 'Income' | 'Expenses') => {
    setDataType(type);
  };

  // const filteredData = useMemo(() => {
  //   const data = (dataType === 'Income' ? salesData : expensesData).map((item) => {
  //     const periodKey = selectedPeriod.toLowerCase() as keyof TotalSalesApprovedData;

  //     return {
  //       month: (item as any)[periodKey]?.toString() || '', // Garantir string vazia
  //       valor: parseFloat(
  //         dataType === 'Income'
  //           ? (item as TotalSalesApprovedData).totalSalesApproved
  //           : (item as TotalExpensesData).totalExpenses
  //       ) || 0, // Garantir que o valor seja 0 se não existir
  //     };
  //   });
  //   return data.length > 0 ? data : [{ month: '', valor: 0 }]; // Retorno padrão se vazio
  // }, [dataType, salesData, expensesData, selectedPeriod]);



  const incomeIsPositive = incomeChangePercentage >= 0;
  const expenseIsPositive = expenseChangePercentage >= 0;

  const incomeChangeColor = incomeIsPositive ? 'success.main' : 'error.main';
  const expensesChangeColor = expenseIsPositive ? 'success.main' : 'error.main';

  const boxSelectedStyles = {
    border: '2px solid',
    borderColor: 'primary.main',
    cursor: 'pointer',
  } as const;

  const boxDefaultStyles = {
    cursor: 'pointer',
  } as const;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>

      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mr: 0.5 }}>
                Lucro Total
              </Typography>
              <Tooltip title="Seu saldo total">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </Tooltip>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              R$ {totalBalance ? totalBalance.toLocaleString('pt-BR') : '0'}
            </Typography>
          </Grid>

          <Grid item>
            <Stack direction="row" spacing={1} alignItems="center">
              <Stack direction="row" spacing={1}>
                {/* <Button
                  variant={selectedPeriod === TimeGranularity.Day ? 'contained' : 'text'}
                  onClick={() => handlePeriodChange(TimeGranularity.Day)}
                  sx={{ textTransform: 'none' }}
                >
                  Dia
                </Button> */}
                {/* <Button
                  variant={selectedPeriod === TimeGranularity.Week ? 'contained' : 'text'}
                  onClick={() => handlePeriodChange(TimeGranularity.Week)}
                  sx={{ textTransform: 'none' }}
                >
                  Semana
                </Button> */}
                {/* <Button
                  variant={selectedPeriod === TimeGranularity.Month ? 'contained' : 'text'}
                  onClick={() => handlePeriodChange(TimeGranularity.Month)}
                  sx={{ textTransform: 'none' }}
                >
                  Mês
                </Button> */}
                {/* <Button
                  variant={selectedPeriod === TimeGranularity.Year ? 'contained' : 'text'}
                  onClick={() => handlePeriodChange(TimeGranularity.Year)}
                  sx={{ textTransform: 'none' }}
                >
                  Ano
                </Button> */}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box
              onClick={() => handleDataTypeClick('Income')}
              sx={{
                bgcolor: '#f4f7f8',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...(dataType === 'Income' ? boxSelectedStyles : boxDefaultStyles),
              }}
            >
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    bgcolor: '#004d45',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <ArrowDownwardIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                      Vendas
                    </Typography>
                    <Tooltip title="Total de vendas registradas neste período">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    R$ {income ? income.toLocaleString('pt-BR') : '0'}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color={incomeChangeColor}>
                {incomeIsPositive ? '+' : ''}{incomeChangePercentage.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              onClick={() => handleDataTypeClick('Expenses')}
              sx={{
                bgcolor: '#f4f7f8',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...(dataType === 'Expenses' ? boxSelectedStyles : boxDefaultStyles),
              }}
            >
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    bgcolor: '#8b5e2e',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  <ArrowUpwardIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                      Despesas
                    </Typography>
                    <Tooltip title="Total de despesas registradas neste período">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    R$ {expenses ? expenses.toLocaleString('pt-BR') : '0'}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color={expensesChangeColor}>
                {expenseIsPositive ? '+' : ''}{expenseChangePercentage.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ width: '100%', height: 250 }}>
          {/* <ResponsiveContainer>
            <LineChart data={filteredData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(valor) => {
                  if (typeof valor === 'undefined' || valor === null) {
                    return 'R$ 0'; // Retorna "0" se o valor for undefined ou null
                  }
                  if (typeof valor === 'number') {
                    return `R$ ${valor.toLocaleString('pt-BR')}`; // Formata números
                  }
                  return `R$ ${valor.toLocaleString('pt-BR')}`; // Converte strings numéricas para número antes de formatar
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={dataType === 'Income' ? "#00695f" : "#8b5e2e"}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialOverviewCard;
