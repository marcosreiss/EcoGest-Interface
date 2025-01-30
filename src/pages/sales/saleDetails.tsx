import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  Table,
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

import { useGetSaleById } from "src/hooks/useSales";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function SaleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const saleId = parseInt(id!, 10);

  const { data: sale, isLoading } = useGetSaleById(saleId);

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/sales/edit/${id}`);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const localDate = new Date(date);
    localDate.setDate(localDate.getDate() + 1);
    return localDate.toLocaleDateString("pt-BR");
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

  const productsList =
    sale?.products.map((product) => ({
      name: product.product.name,
      productId: product.product.productId,
      quantity: product.quantity,
      price: product.price || 0,
    })) || [];

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
            <Box sx={{display: "flex", alignItems: 'center', justifyContent: 'space-between'}}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Detalhes da Venda
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ fontSize: 15 }}
              >
                Editar Venda
              </Button>
            </Box>

            {/* Card Principal */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Nome e CPF/CNPJ do Cliente */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">
                      Cliente
                    </Typography>
                    <Typography paddingLeft={2}>
                      <strong>Nome:</strong> {sale?.customer?.name || "-"}
                    </Typography>
                    <Typography paddingLeft={2}>
                      <strong>CPF/CNPJ:</strong> {sale?.customer?.cpfCnpj || "-"}
                    </Typography>
                  </Grid>

                  {/* Data da Venda */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">
                      Detalhes
                    </Typography>
                    <Typography paddingLeft={2}>
                      <strong>Data:</strong> {formatDate(sale?.date_time)}
                    </Typography>
                    <Typography paddingLeft={2}>
                      <strong>Descrição:</strong> {sale?.description || "-"}
                    </Typography>
                  </Grid>


                </Grid>
              </CardContent>
            </Card>

            {/* Lista de Produtos */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <CardHeader title="Produtos" titleTypographyProps={{ variant: "h6" }} />
              <Divider />
              <CardContent>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Produto</strong></TableCell>
                      <TableCell><strong>Qtd</strong></TableCell>
                      <TableCell><strong>Preço</strong></TableCell>
                      <TableCell><strong>Subtotal</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsList.length > 0 ? (
                      productsList.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{formatNumber(product.quantity)}</TableCell>
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
                {/* Preço e desconto */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography>
                        <strong>Desconto:</strong> {formatPrice(sale?.discount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography>
                        <strong>Preço Total:</strong> {formatPrice(sale?.totalPrice)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </DashboardContent>
    </>
  );
}
