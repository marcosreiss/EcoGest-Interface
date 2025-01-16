import React from "react";

import { Box, Grid, Card, Typography, CardContent, LinearProgress } from "@mui/material";

import { useGetTotalProductsInStock } from "src/hooks/useProduct";

import { DashboardContent } from "src/layouts/dashboard";

export default function StockPage() {
  const { data, isLoading } = useGetTotalProductsInStock();

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "-";
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <DashboardContent maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Estoque
          </Typography>
        </Grid>

        {/* Exibindo LinearProgress enquanto carrega */}
        {isLoading && (
          <Grid item xs={12}>
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </Grid>
        )}

        {/* Renderizando os cards após o carregamento */}
        {!isLoading &&
          data?.totalProductsInStock.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ boxShadow: 3, textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="h5" color="primary">
                    {formatPrice(item.totalWeight)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </DashboardContent>
  );
}
