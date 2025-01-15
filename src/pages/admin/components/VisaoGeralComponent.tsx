import React, { useState } from "react";

import {
  Box,
  Grid,
  Card,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import GenerateDailyReport from "./generateDailyReport";

export default function VisaoGeralComponent() {
  // Mock de dados
  const dataMock = {
    saldo: 12500.75,
    contasReceber: 150,
    contasPagar: 120,
    contasReceberAtrasadas: 15,
    contasPagarAtrasadas: 10,
  };

  const [isLoading] = useState(false);

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
            <GenerateDailyReport />
          </Box>

          {/* Indicador de Carregamento */}
          {isLoading && <LinearProgress sx={{ mb: 3, width: "100%" }} />}
        </Grid>

        {/* Saldo Total */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Saldo Total
              </Typography>
              <Typography variant="h5">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(dataMock.saldo)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Indicadores */}
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
                  <Typography variant="h5" >
                    {dataMock.contasReceber}
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
                    {dataMock.contasPagar}
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
                  <Typography variant="h5" >
                    {dataMock.contasReceberAtrasadas}
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
                    {dataMock.contasPagarAtrasadas}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
