import React from "react";
import { Box, Grid, Card, Typography, CardContent, LinearProgress } from "@mui/material";
import { useGetTotalProductsInStock } from "src/hooks/useProduct";
import { DashboardContent } from "src/layouts/dashboard";
import InventoryIcon from "@mui/icons-material/Inventory"; // Ícone para ilustrar o estoque

export default function StockPage() {
  const { data, isLoading } = useGetTotalProductsInStock();

  const formatWeight = (weight: number | undefined): string => {
    if (weight === undefined) return "-";
    const tons = weight / 1000; // Convertendo para toneladas
    return `${tons.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} tons.`;
  };

  // Função para definir a cor do card com base no nome do produto
  const getCardColor = (productName: string | undefined): string => {
    if (!productName) {
      return "#34B864"; // Padrão caso o nome seja undefined
    }

    const name = productName.toLowerCase();

    if (name.includes("papel")) {
      return "#3e6b7c"; // Azul para papel (reciclagem)
    }
    if (name.includes("vidro")) {
      return "#6abf4b"; // Verde para vidro
    }
    if (name.includes("metal") || name.includes("ferro")) {
      return "#d5ab09"; // Amarelo para metal
    }
    if (name.includes("plástico") || name.includes("plastico")) {
      return "#f44336"; // Vermelho para plástico
    }
    return "#34B864"; // Cinza padrão para outros
  };

  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Estoque
        </Typography>
      </Box>

      <Grid container spacing={4}>
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
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  boxShadow: 3,
                  textAlign: "center",
                  p: 2,
                  border: "1px solid",
                  borderColor: getCardColor(item.name), // Define a cor da borda
                  backgroundColor: `${getCardColor(item.name)}20`, // Define um fundo com transparência
                  borderRadius: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2, color: getCardColor(item.name) }}>
                    <InventoryIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item.name || "Produto Desconhecido"}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {formatWeight(item.totalWeight)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {/* Caso não haja dados disponíveis */}
        {!isLoading && (!data?.totalProductsInStock || data.totalProductsInStock.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ textAlign: "center", color: "text.secondary" }}>
              Nenhum produto em estoque no momento.
            </Typography>
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  );
}
