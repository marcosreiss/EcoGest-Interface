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


  const formatDate = (date?: string) => {
    if (!date) return "-";
    const localDate = new Date(date);

    // Adicionar 1 dia
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
                {/* Nome e CPF/CNPJ do Cliente */}
                <Grid item xs={12}>
                  <Typography variant="h6">Cliente</Typography>
                  <Typography>
                    <strong>Nome:</strong> {sale?.customer?.name || "-"}
                  </Typography>
                  <Typography>
                    <strong>CPF/CNPJ:</strong> {sale?.customer?.cpfCnpj || "-"}
                  </Typography>
                </Grid>

                {/* Descrição */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Descrição:</strong> {sale?.description || "-"}
                  </Typography>
                </Grid>

                {/* Data da Venda */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Data da Venda:</strong> {formatDate(sale?.date_time)}
                  </Typography>
                </Grid>

                {/* Desconto */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Desconto:</strong> {formatPrice(sale?.discount)}
                  </Typography>
                </Grid>

                {/* Preço Total */}
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Preço Total:</strong> {formatPrice(sale?.totalPrice)}
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
                          <TableCell>
                            {formatNumber(Number(saleProduct.quantity / 1000))} Tons
                          </TableCell>
                          <TableCell>
                            {formatPrice(saleProduct.product.price)}
                          </TableCell>
                          <TableCell>
                            {formatPrice(saleProduct.totalPrice)}
                          </TableCell>
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
              </Grid>
            </Box>
          </>
        )}
      </DashboardContent>
    </>
  );
}
