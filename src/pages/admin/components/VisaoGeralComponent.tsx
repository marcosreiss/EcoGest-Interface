import {
  Box,
  Grid,
  Card,
  Typography,
  CardContent,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import { useGetSaldoProjetado, useGetPaybleRecibleAmount } from "src/hooks/useKpi";

export default function VisaoGeralComponent() {
  const {
    data: paybleRecibleAmount,
    isLoading: isLoadingPayableRecibleAmount,
  } = useGetPaybleRecibleAmount();

  const {
    data: saldoProjetado,
    isLoading: isLoadingSaldoProjetado,
  } = useGetSaldoProjetado();

  const isLoading = isLoadingPayableRecibleAmount || isLoadingSaldoProjetado;

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "-";
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4}>
        {/* Título */}
        <Grid item xs={12}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            Visão Geral
          </Typography>
        </Grid>

        {/* Loading Indicator */}
        {isLoading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {/* Saldo Total Projetado */}
        {!isLoading && (
          <Grid item xs={12}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 3,
                borderRadius: 3,
                boxShadow: 5,
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.dark",
                  width: 56,
                  height: 56,
                  mr: 3,
                }}
              >
                <AttachMoneyIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  Saldo Total Projetado
                  <Tooltip title="O saldo total projetado inclui todas as compras, vendas e lançamentos registrados." arrow>
                    <IconButton sx={{ color: "white", ml: 1 }}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {formatPrice(saldoProjetado?.profit.profit)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        )}

        {/* Indicadores */}
        {!isLoading && (
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {/* Contas a Receber */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    boxShadow: 4,
                    borderRadius: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "success.main",
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <TrendingUpIcon />
                    </Avatar>
                    <Typography variant="h6">
                      Contas a Receber
                      <Tooltip title="Total de contas a receber ainda em aberto." arrow>
                        <IconButton sx={{ ml: 1 }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ mt: 2, fontWeight: "bold", color: "success.dark" }}
                  >
                    {paybleRecibleAmount?.data.receivables.open}
                  </Typography>
                </Card>
              </Grid>

              {/* Contas a Pagar */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    boxShadow: 4,
                    borderRadius: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "error.main",
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <TrendingDownIcon />
                    </Avatar>
                    <Typography variant="h6">
                      Contas a Pagar
                      <Tooltip title="Total de contas a pagar ainda em aberto." arrow>
                        <IconButton sx={{ ml: 1 }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ mt: 2, fontWeight: "bold", color: "error.dark" }}
                  >
                    {paybleRecibleAmount?.data.payables.open}
                  </Typography>
                </Card>
              </Grid>

              {/* Contas Receber Atrasadas */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    boxShadow: 4,
                    borderRadius: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "warning.main",
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <WarningIcon />
                    </Avatar>
                    <Typography variant="h6">
                      Contas A Receber Atrasadas
                      <Tooltip title="Total de contas a receber com prazo de vencimento expirado." arrow>
                        <IconButton sx={{ ml: 1 }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ mt: 2, fontWeight: "bold", color: "warning.dark" }}
                  >
                    {paybleRecibleAmount?.data.receivables.overdue}
                  </Typography>
                </Card>
              </Grid>

              {/* Contas Pagar Atrasadas */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    p: 3,
                    boxShadow: 4,
                    borderRadius: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "error.main",
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <WarningIcon />
                    </Avatar>
                    <Typography variant="h6">
                      Contas A Pagar Atrasadas
                      <Tooltip title="Total de contas a pagar com prazo de vencimento expirado." arrow>
                        <IconButton sx={{ml: 1 }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ mt: 2, fontWeight: "bold", color: "error.dark" }}
                  >
                    {paybleRecibleAmount?.data.payables.overdue}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
