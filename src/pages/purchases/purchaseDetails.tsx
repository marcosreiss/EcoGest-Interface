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
      const blob = new Blob([new Uint8Array(purchase.paymentSlip.data)]);
      const fileReader = new FileReader();
  
      fileReader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const uintArray = new Uint8Array(arrayBuffer);
  
        // Extrai os primeiros bytes para verificação do tipo
        const header = uintArray.slice(0, 4);
  
        // Converte os primeiros bytes para uma string legível
        const headerHex = Array.from(header).map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
  
        if (headerHex.startsWith("25 50 44 46")) {
          // PDF (%PDF)
          const pdfBlob = new Blob([uintArray], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, "_blank");
        } else if (headerHex.startsWith("ff d8 ff")) {
          // JPEG (FFD8FF)
          const jpegBlob = new Blob([uintArray], { type: "image/jpeg" });
          const jpegUrl = URL.createObjectURL(jpegBlob);
          window.open(jpegUrl, "_blank");
        } else if (headerHex.startsWith("89 50 4e 47")) {
          // PNG (\x89PNG)
          const pngBlob = new Blob([uintArray], { type: "image/png" });
          const pngUrl = URL.createObjectURL(pngBlob);
          window.open(pngUrl, "_blank");
        } 
      };
      
      fileReader.readAsArrayBuffer(blob);
    }
  };
  

  // Função para formatar a data no formato pt-BR
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
