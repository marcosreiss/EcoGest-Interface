import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetSaleById } from "src/hooks/useSales";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function SaleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const saleId = parseInt(id!, 10);

  const { data: sale, isLoading } = useGetSaleById(saleId);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/sales/edit/${id}`);
  };

  // Função para formatar preço no padrão Real (ex.: R$ 1.000,00)
  const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para formatar quantidade com duas casas decimais (ex.: 1,50)
  const formatQuantity = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Função para traduzir status
  const translateStatus = (status?: string) => {
    switch (status) {
      case "processing":
        return "Processando";
      case "approved":
        return "Aprovada";
      case "canceled":
        return "Cancelada";
      default:
        return status || "-";
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes da Venda - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="md">
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Grid item xs={6}>
              <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                Detalhes da Venda
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box sx={formStyle}>
                  <Grid container spacing={2}>
                    {/* Nome do Cliente */}
                    <Grid item xs={6}>
                      <Typography variant="h6" gutterBottom>
                        Cliente: {sale?.customer?.name || "-"}
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
                        Produto: {sale?.product?.name || "-"}
                      </Typography>
                    </Grid>

                    {/* Quantidade formatada */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Quantidade:{" "}
                        {sale?.quantity !== undefined
                          ? `${formatQuantity(sale.quantity)} Toneladas`
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* Preço Total formatado */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Preço Total:{" "}
                        {sale?.totalPrice !== undefined
                          ? formatPrice(sale.totalPrice)
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* Status traduzido */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Status: {translateStatus(sale?.saleStatus)}
                      </Typography>
                    </Grid>

                    {/* Data da Venda */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Data da Venda:{" "}
                        {sale?.date_time
                          ? new Date(sale.date_time).toLocaleDateString("pt-BR")
                          : "-"}
                      </Typography>
                    </Grid>
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
