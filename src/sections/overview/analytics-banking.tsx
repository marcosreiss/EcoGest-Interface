import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tooltip,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DataPoint {
  month: string;
  value: number;
}

// Dados de exemplo
const DATA_SETS = {
  Income: {
    Day:    [ { month: 'Mon', value: 100 }, { month: 'Tue', value: 120 }, { month: 'Wed', value: 90 }, { month: 'Thu', value: 150 }, { month: 'Fri', value: 110 } ],
    Week:   [ { month: 'W1', value: 500 }, { month: 'W2', value: 700 }, { month: 'W3', value: 650 }, { month: 'W4', value: 800 } ],
    Month:  [ { month: 'Jan', value: 5 }, { month: 'Feb', value: 15 }, { month: 'Mar', value: 20 }, { month: 'Apr', value: 35 }, { month: 'May', value: 90 }, { month: 'Jun', value: 70 }, { month: 'Jul', value: 60 }, { month: 'Aug', value: 65 }, { month: 'Sep', value: 70 } ],
    Year:   [ { month: '2020', value: 4000 }, { month: '2021', value: 4500 }, { month: '2022', value: 4800 }, { month: '2023', value: 5200 } ],
  },
  Expenses: {
    Day:    [ { month: 'Mon', value: 80 }, { month: 'Tue', value: 100 }, { month: 'Wed', value: 60 }, { month: 'Thu', value: 70 }, { month: 'Fri', value: 90 } ],
    Week:   [ { month: 'W1', value: 300 }, { month: 'W2', value: 400 }, { month: 'W3', value: 450 }, { month: 'W4', value: 500 } ],
    Month:  [ { month: 'Jan', value: 2 }, { month: 'Feb', value: 8 }, { month: 'Mar', value: 12 }, { month: 'Apr', value: 18 }, { month: 'May', value: 30 }, { month: 'Jun', value: 28 }, { month: 'Jul', value: 22 }, { month: 'Aug', value: 25 }, { month: 'Sep', value: 27 } ],
    Year:   [ { month: '2020', value: 2000 }, { month: '2021', value: 2200 }, { month: '2022', value: 2500 }, { month: '2023', value: 2700 } ],
  },
};

interface FinancialOverviewCardProps {
  totalBalance: number;
  income: number;
  incomeChangePercentage: number;
  expenses: number;
  expenseChangePercentage: number;
  onPeriodChange?: (period: string) => void;
}

const FinancialOverviewCard: React.FC<FinancialOverviewCardProps> = ({
  totalBalance,
  income,
  incomeChangePercentage,
  expenses,
  expenseChangePercentage,
  onPeriodChange,
}) => {
  
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [dataType, setDataType] = useState<'Income'|'Expenses'>('Income');

  // Campos de busca: Income => Customers, Products | Expenses => Suppliers, Products
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (onPeriodChange) onPeriodChange(period);
  };

  const handleDataTypeClick = (type: 'Income'|'Expenses') => {
    setDataType(type);
    // Zerar buscas ao trocar de tipo (opcional)
    setSearchQuery1('');
    setSearchQuery2('');
  };

  // Filtra dados conforme tipo, período, e buscas
  const filteredData = useMemo(() => {
    const data = DATA_SETS[dataType][selectedPeriod as keyof typeof DATA_SETS['Income']] || [];

    // Implementação simples: Filtramos o campo month se contiver as strings digitadas
    // Caso queira lógica mais complexa, ajuste aqui.
    return data.filter((point) => {
      const monthLower = point.month.toLowerCase();
      // Se há alguma busca, verificamos se o month contém essas buscas
      const matchQ1 = searchQuery1 ? monthLower.includes(searchQuery1.toLowerCase()) : true;
      const matchQ2 = searchQuery2 ? monthLower.includes(searchQuery2.toLowerCase()) : true;
      return matchQ1 && matchQ2;
    });
  }, [selectedPeriod, dataType, searchQuery1, searchQuery2]);

  const incomeIsPositive = incomeChangePercentage >= 0;
  const expenseIsPositive = expenseChangePercentage >= 0;

  const incomeChangeColor = incomeIsPositive ? 'success.main' : 'error.main';
  const expensesChangeColor = expenseIsPositive ? 'success.main' : 'error.main';

  // Estilos condicionais para destacar o box selecionado
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
        {/* Linha superior: Título e filtros de período */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mr: 0.5 }}>
                Total balance
              </Typography>
              <Tooltip title="Your total account balance">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </Tooltip>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              ${totalBalance.toLocaleString()}
            </Typography>
          </Grid>

          <Grid item>
            <Stack direction="row" spacing={1} alignItems="center">
              <Stack direction="row" spacing={1}>
                <Button 
                  variant={selectedPeriod === 'Day' ? 'contained' : 'text'} 
                  onClick={() => handlePeriodChange('Day')}
                  sx={{ textTransform: 'none' }}
                >
                  Day
                </Button>
                <Button 
                  variant={selectedPeriod === 'Week' ? 'contained' : 'text'} 
                  onClick={() => handlePeriodChange('Week')}
                  sx={{ textTransform: 'none' }}
                >
                  Week
                </Button>
                <Button 
                  variant={selectedPeriod === 'Month' ? 'contained' : 'text'} 
                  onClick={() => handlePeriodChange('Month')}
                  sx={{ textTransform: 'none' }}
                >
                  Month
                </Button>
                <Button 
                  variant={selectedPeriod === 'Year' ? 'contained' : 'text'} 
                  onClick={() => handlePeriodChange('Year')}
                  sx={{ textTransform: 'none' }}
                >
                  Year
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Caixa Income como botão */}
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
                      Income
                    </Typography>
                    <Tooltip title="Total income recorded over this period">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    ${income.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color={incomeChangeColor}>
                {incomeIsPositive ? '+' : ''}{incomeChangePercentage.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>

          {/* Caixa Expenses como botão */}
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
                      Expenses
                    </Typography>
                    <Tooltip title="Total expenses recorded over this period">
                      <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    ${expenses.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color={expensesChangeColor}>
                {expenseIsPositive ? '+' : ''}{expenseChangePercentage.toFixed(1)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Campos de busca dinâmicos conforme tipo selecionado */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {dataType === 'Income' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search by Customers"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                  placeholder="Type customer name..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search by Products"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                  placeholder="Type product name..."
                />
              </Grid>
            </>
          )}

          {dataType === 'Expenses' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search by Suppliers"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                  placeholder="Type supplier name..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search by Products"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                  placeholder="Type product name..."
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* Gráfico */}
        <Box sx={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={filteredData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={dataType === 'Income' ? "#00695f" : "#8b5e2e"} 
                strokeWidth={3} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialOverviewCard;
