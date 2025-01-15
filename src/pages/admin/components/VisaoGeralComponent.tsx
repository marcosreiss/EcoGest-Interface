import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";

export default function VisaoGeralComponent() {
  // Mock de dados
  const dataMock = {
    saldo: 12500.75,
    contasReceber: 150,
    contasPagar: 120,
    contasReceberAtrasadas: 15,
    contasPagarAtrasadas: 10,
  };

  const [isLoading, setIsLoading] = useState(false); // Simula o carregamento

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visão Geral 
      </Typography>

      {/* Indicador de Carregamento */}
      {isLoading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Dashboard de Indicadores */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Saldo Total
              </Typography>
              <Typography variant="h5" color="primary">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(dataMock.saldo)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contas a Receber
              </Typography>
              <Typography variant="h5" color="secondary">
                {dataMock.contasReceber}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contas a Pagar
              </Typography>
              <Typography variant="h5" color="error">
                {dataMock.contasPagar}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contas Receber Atrasadas
              </Typography>
              <Typography variant="h5" color="warning">
                {dataMock.contasReceberAtrasadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contas Pagar Atrasadas
              </Typography>
              <Typography variant="h5" color="warning">
                {dataMock.contasPagarAtrasadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
