import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
    Box,
    Grid,
    Card,
    Typography,
    CardContent,
    LinearProgress,
} from "@mui/material";

import { useGetPaybleById } from "src/hooks/usePayble";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

// Função para formatar valores monetários em PT-BR
const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "-";
    const parsedPrice = typeof price === "string" ? parseFloat(price) : price;
    return `R$ ${parsedPrice.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// Função para formatar datas em PT-BR
const formatDate = (date?: string): string => {
    if (!date) return "-";
    const localDate = new Date(date);

    // Adicionar 1 dia
    localDate.setDate(localDate.getDate() + 1);

    return localDate.toLocaleDateString("pt-BR");
};

export default function PayableDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const paybleId = parseInt(id!, 10);

    const { data: payble, isLoading } = useGetPaybleById(paybleId);

    

    return (
        <>
            <Helmet>
                <title>{`Detalhes de a Pagar - ${CONFIG.appName}`}</title>
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
                                Detalhes da Conta a Pagar
                            </Typography>
                        </Box>
                        <Card elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Grid container spacing={3}>
                                    {/* ID */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Cód
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {payble?.payableId || "-"}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Status */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Status
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {payble?.status || "-"}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Data de Emissão */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Data de Emissão
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {formatDate(payble?.dataEmissao)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Data do Pagamento */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Data do Pagamento
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {formatDate(payble?.dataPagamento)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Data de Vencimento */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Data de Vencimento
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {formatDate(payble?.dataVencimento)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Valor Total */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Valor Total
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {formatPrice(payble?.totalValue)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Pagável relacionado a Entry ou Purchase */}
                                    {payble?.entry ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Lançamento
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Tipo de Entrada
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {payble.entry.type}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Descrição
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {payble.entry.description || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Valor
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatPrice(payble.entry.value)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : payble?.purchase ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Compra
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Descrição da Compra
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {payble.purchase.description || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Fornecedor
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {payble.purchase.supplier?.name || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    NF-e
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {payble.purchase.nfe || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Data da Compra
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatDate(payble.purchase.date_time)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Desconto
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatPrice(payble.purchase.discount)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Valor Total da Compra
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatPrice(payble.purchase.totalPrice)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Nenhuma entrada ou compra associada.
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                )}
            </DashboardContent >
        </>
    );
}
