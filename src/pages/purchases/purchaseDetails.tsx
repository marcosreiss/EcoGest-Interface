import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Button,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetPurchaseById } from "src/hooks/usePurchase";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function PurchaseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const purchaseId = parseInt(id!, 10);

  const { data: purchase, isLoading } = useGetPurchaseById(purchaseId);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/purchases/edit/${id}`);
  };

  const handleViewFile = () => {
    if (purchase?.paymentSlip?.data) {
      const blob = new Blob([new Uint8Array(purchase.paymentSlip.data)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  // Função para traduzir status
  const translateStatus = (status?: string) => {
    switch (status) {
      case "processing":
        return "Processando";
      case "approved":
        return "Aprovado";
      case "canceled":
        return "Cancelado";
      default:
        return status || "-";
    }
  };
    // Função para formatar a data no formato pt-BR
    const formatDate = (dateStr?: string | Date) => {
      if (!dateStr) return "-";
      const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
      dateObj.setDate(dateObj.getDate() + 1);
      return dateObj.toLocaleDateString("pt-BR");
    };

  // Formata o valor em R$ (Real)
  const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formata a quantidade (por exemplo, duas casas decimais)
  const formatQuantity = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes da Compra - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="md">
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Grid item xs={6}>
              <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                Detalhes da Compra
              </Typography>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Box sx={formStyle}>
                  <Grid container spacing={2}>
                    {/* Nome do Fornecedor */}
                    <Grid item xs={6}>
                      <Typography variant="h6" gutterBottom>
                        Fornecedor: {purchase?.supplier?.name || "-"}
                      </Typography>
                    </Grid>

                    {/* Botão de Editar */}
                    <Grid item xs={6}>
                      <IconButton onClick={handleEditClick}>
                        <img alt="icon" src="/assets/icons/ic-edit.svg" />
                      </IconButton>
                    </Grid>

                    {/* Nome do Produto */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Produto: {purchase?.product?.name || "-"}
                      </Typography>
                    </Grid>

                    {/* Quantidade formatada */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Quantidade:{" "}
                        {purchase?.weightAmount !== undefined
                          ? `${formatQuantity(purchase.weightAmount)} Kilogramas`
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* Preço formatado */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Preço unitário:{" "}
                        {purchase?.price !== undefined
                          ? formatPrice(purchase.price)
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* Preço formatado */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Preço total:{" "}
                        {purchase?.totalPrice !== undefined
                          ? formatPrice(purchase.totalPrice)
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* Status traduzido */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Status: {translateStatus(purchase?.purchaseStatus)}
                      </Typography>
                    </Grid>

                    {/* Data da Compra */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Data da Compra:{" "}
                        {formatDate(purchase?.date_time) || "" }
                      </Typography>
                    </Grid>

                    {/* Descrição */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Descrição: {purchase?.description || "-"}
                      </Typography>
                    </Grid>

                    {/* Visualizar Arquivo */}
                    {purchase?.paymentSlip?.data && (
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleViewFile}
                          fullWidth
                        >
                          Visualizar Nota Fiscal
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </DashboardContent>
    </>
  );
}
