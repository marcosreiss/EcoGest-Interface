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

import { useGetReceiveById } from "src/hooks/useReceive";

import { CONFIG } from "src/config-global";
import { EntryType } from "src/models/entry";
import { DashboardContent } from "src/layouts/dashboard";

// Função para formatar valores monetários em PT-BR
const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

// Função para formatar datas em PT-BR
const formatDate = (date?: string) => {
    if (!date) return "-";
    const localDate = new Date(date);
    localDate.setDate(localDate.getDate() + 1);
    return localDate.toLocaleDateString("pt-BR");
};

export default function ReceiveDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const receiveId = parseInt(id!, 10);

    const { data: receive, isLoading } = useGetReceiveById(receiveId);

    return (
        <>
            <Helmet>
                <title>{`Detalhes de a Receber - ${CONFIG.appName}`}</title>
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
                                Detalhes da Conta a Receber
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
                                                {receive?.receiveId || "-"}
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
                                                {receive?.status || "-"}
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
                                                {formatDate(receive?.dataEmissao)}
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
                                                {formatDate(receive?.dataVencimento)}
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
                                                {formatDate(receive?.dataPagamento)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Valor Pago */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Valor Pago
                                        </Typography>
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="body1">
                                                {formatPrice(receive?.payedValue)}
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
                                                {formatPrice(receive?.totalValue)}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Recebimento relacionado a Entry ou Sale */}
                                    {receive?.entry ? (
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
                                                        {receive.entry.type === EntryType.ganho
                                                            ? "Entrada"
                                                            : "Saída"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Subtipo
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {receive.entry.subtype || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Descrição
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {receive.entry.description || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Valor
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatPrice(receive.entry.value)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Data e Hora
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatDate(receive.entry.date_time)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Criado em
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatDate(receive.entry.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : receive?.sale ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Venda
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    ID da Venda
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {receive.sale.saleId || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Cliente
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {receive.sale.customer?.name || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Data e Hora
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatDate(receive.sale.date_time)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Descrição
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {receive.sale.description || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    NF-e
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {receive.sale.nfe || "-"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Desconto
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatPrice(receive.sale.discount)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    Preço Total
                                                </Typography>
                                                <Box sx={{ ml: 1 }}>
                                                    <Typography variant="body1">
                                                        {formatPrice(receive.sale.totalPrice)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Nenhuma entrada ou venda associada.
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </>
                )}
            </DashboardContent>
        </>
    );
}
