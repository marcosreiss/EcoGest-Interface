import {
  Box,
  Grid,
  Card,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {/* Título e Relatório Diário */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1">
              Visão Geral
            </Typography>
          </Box>
        </Grid>

        {/* Exibe LinearProgress enquanto os dados estão sendo carregados */}
        {isLoading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {/* Saldo Total */}
        {!isLoading && (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Saldo Total
                </Typography>
                <Typography variant="h5">
                  {formatPrice(saldoProjetado?.profit.profit)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Indicadores */}
        {!isLoading && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {/* Contas a Receber */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contas a Receber
                    </Typography>
                    <Typography variant="h5">
                      {paybleRecibleAmount?.data.receivables.open || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contas a Pagar */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contas a Pagar
                    </Typography>
                    <Typography variant="h5">
                      {paybleRecibleAmount?.data.payables.open || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contas Receber Atrasadas */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contas Receber Atrasadas
                    </Typography>
                    <Typography variant="h5">
                      {paybleRecibleAmount?.data.receivables.overdue || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contas Pagar Atrasadas */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contas Pagar Atrasadas
                    </Typography>
                    <Typography variant="h5">
                      {paybleRecibleAmount?.data.payables.overdue || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
