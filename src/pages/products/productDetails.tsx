import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  Button,
  Divider,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetProductById } from "src/hooks/useProduct";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

// Função para formatar o peso em PT-BR
const formatWeight = (weightKg: number | string | undefined): string => {
  if (weightKg === undefined || weightKg === null) return "-";

  const weight = typeof weightKg === "string" ? parseFloat(weightKg) : weightKg;

  const weightInTons = weight / 1000;

  return `${weightInTons.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Toneladas`;
};

// Função para formatar o preço em PT-BR
const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null) return "-";
  const parsedPrice = typeof price === "string" ? parseFloat(price) : price;
  return `R$ ${parsedPrice.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id!, 10);

  const { data: product, isLoading } = useGetProductById(productId);
  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/products/edit/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes do Produto - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="lg">
        {isLoading ? (
          <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
            <LinearProgress sx={{ width: "50%" }} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                Detalhes do Produto
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ fontSize: 15 }}
              >
                Editar
              </Button>
            </Box>

            <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Nome e Botão de Editar */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Informações do Produto
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Nome:</strong> {product?.name || "-"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Quantidade */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Quantidade
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {formatWeight(product?.weightAmount)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Preço */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Preço
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {formatPrice(product?.price)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                
              </CardContent>
            </Card>
          </>
        )}
      </DashboardContent>
    </>
  );
}
