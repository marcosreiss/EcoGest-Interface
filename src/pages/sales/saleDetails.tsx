// src/pages/sales/SaleDetailsPage.tsx

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

  // const handleViewReceipt = () => {
  //   if (sale?.receipt?.data) {
  //     const blob = new Blob([new Uint8Array(sale.receipt.data)], {
  //       type: "application/pdf",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     window.open(url, "_blank");
  //   }
  // };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return dateObj.toLocaleDateString("pt-BR");
  };

  const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes da Venda - ${CONFIG.appName}`}</title>
      </Helmet>
      <DashboardContent maxWidth="lg">
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Detalhes da Venda
            </Typography>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                {/* Informações do Cliente */}
                {/* <Grid item xs={12}>
                  <Typography variant="h6">Cliente</Typography>
                  <Typography>
                    Nome: {sale?.person.name || "-"}
                  </Typography>
                </Grid> */}

                {/* Descrição */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Descrição: {sale?.description || "-"}
                  </Typography>
                </Grid>

                {/* Data da Venda */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Data da Venda: {formatDate(sale?.date_time)}
                  </Typography>
                </Grid>

                {/* Desconto */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Desconto: {formatPrice(sale?.discount)}
                  </Typography>
                </Grid>

                {/* Preço Total */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Preço Total: {formatPrice(sale?.totalPrice)}
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
                      {sale?.products.map((saleProduct) => (
                        <TableRow key={saleProduct.product.productId}>
                          <TableCell>{saleProduct.product.name}</TableCell>
                          <TableCell>{saleProduct.quantity}</TableCell>
                          <TableCell>{formatPrice(saleProduct.product.price)}</TableCell>
                          <TableCell>{formatPrice(saleProduct.totalPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>

                {/* Botão para Editar */}
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={handleEditClick}>
                    Editar Venda
                  </Button>
                </Grid>

                {/* Recibo */}
                {/* {sale?.receipt?.data && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleViewReceipt}
                      fullWidth
                    >
                      Visualizar Recibo
                    </Button>
                  </Grid>
                )} */}
              </Grid>
            </Box>
          </>
        )}
      </DashboardContent>
    </>
  );
}
