import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  Table,
  Paper,
  Button,
  Divider,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  CardHeader,
  CardContent,
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

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/purchases/edit/${id}`);
  };

  const handleViewFile = () => {
    if (purchase?.paymentSlip?.data) {
      const blob = new Blob([new Uint8Array(purchase.paymentSlip.data)]);
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const uintArray = new Uint8Array(arrayBuffer);

        const header = uintArray.slice(0, 4);
        const headerHex = Array.from(header)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ");

        if (headerHex.startsWith("25 50 44 46")) {
          const pdfBlob = new Blob([uintArray], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, "_blank");
        } else if (headerHex.startsWith("ff d8 ff")) {
          const jpegBlob = new Blob([uintArray], { type: "image/jpeg" });
          const jpegUrl = URL.createObjectURL(jpegBlob);
          window.open(jpegUrl, "_blank");
        } else if (headerHex.startsWith("89 50 4e 47")) {
          const pngBlob = new Blob([uintArray], { type: "image/png" });
          const pngUrl = URL.createObjectURL(pngBlob);
          window.open(pngUrl, "_blank");
        }
      };

      fileReader.readAsArrayBuffer(blob);
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("pt-BR");
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

  const productsList = purchase?.products.map((product) => ({
    name: product.product.name,
    productId: product.product.productId,
    quantity: product.quantity,
    price: product.price || 0,
  })) || [];

  return (
    <>
      <Helmet>
        <title>{`Detalhes da Compra - ${CONFIG.appName}`}</title>
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
                Detalhes da Compra
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ fontSize: 15 }}
              >
                Editar Compra
              </Button>
            </Box>

            <Card elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Fornecedor */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Fornecedor
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Nome:</strong> {purchase?.supplier.name || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>CPF/CNPJ:</strong> {purchase?.supplier.cpfCnpj || "-"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Detalhes da Compra */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Detalhes
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Data da Compra:</strong> {formatDate(purchase?.date_time)}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Descrição:</strong> {purchase?.description || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Desconto:</strong> {formatPrice(purchase?.discount)}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Preço Total:</strong> {formatPrice(purchase?.totalPrice)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <CardHeader
                title="Produtos"
                titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
              />
              <CardContent>
                <Paper variant="outlined" sx={{ overflow: "hidden" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Produto</strong></TableCell>
                        <TableCell><strong>Quantidade</strong></TableCell>
                        <TableCell><strong>Preço Unitário</strong></TableCell>
                        <TableCell><strong>Total</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productsList.length > 0 ? (
                        productsList.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{formatNumber(product.quantity / 1000)} Tons</TableCell>
                            <TableCell>{formatPrice(product.price)}</TableCell>
                            <TableCell>{formatPrice(product.price * product.quantity)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Nenhum produto encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
                <Divider sx={{ my: 3 }} />
                {purchase?.paymentSlip?.data && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewFile}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Visualizar Nota Fiscal
                  </Button>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </DashboardContent>
    </>
  );
}
