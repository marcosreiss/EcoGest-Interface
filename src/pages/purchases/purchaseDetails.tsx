import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Table,
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
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

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (value?: number) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value?: number) => {
    if (value === undefined || value === null) return "-";
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes da Compra - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="lg">
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Detalhes da Compra
            </Typography>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                {/* Nome do Fornecedor */}
                <Grid item xs={12}>
                  <Typography variant="h6">Fornecedor</Typography>
                  <Typography>
                    <strong>Nome:</strong> {purchase?.supplier.name || "-"}
                  </Typography>
                  <Typography>
                    <strong>CPF/CNPJ:</strong> {purchase?.supplier.cpfCnpj || "-"}
                  </Typography>
                </Grid>

                {/* Descrição */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Descrição:</strong> {purchase?.description || "-"}
                  </Typography>
                </Grid>

                {/* Data da Compra */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Data da Compra:</strong> {formatDate(purchase?.date_time)}
                  </Typography>
                </Grid>

                {/* Desconto */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Desconto:</strong> {formatPrice(purchase?.discount)}
                  </Typography>
                </Grid>

                {/* Lista de Produtos */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Produtos
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell>Preço Unitário</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {purchase?.products.map((product) => (
                        <TableRow key={product.productId}>
                          <TableCell>{product.product.name}</TableCell>
                          <TableCell>{formatNumber(product.quantity / 1000)} Tons</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>{formatPrice(product.quantity * product.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>

                {/* Botão para Editar */}
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleEditClick}>
                    Editar Compra
                  </Button>
                </Grid>

                {/* Nota Fiscal */}
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
          </>
        )}
      </DashboardContent>
    </>
  );
}
