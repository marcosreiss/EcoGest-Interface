import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography,  LinearProgress } from "@mui/material";

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

const formatDate = (date?: string) => {
    if (!date) return "-";
    const localDate = new Date(date);
  
    // Adicionar 1 dia
    localDate.setDate(localDate.getDate() + 1);
  
    return localDate.toLocaleDateString("pt-BR");
  };
export default function PayableDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const paybleId = parseInt(id!, 10);

    const response = useGetPaybleById(paybleId);
    const payble = response.data;
    const { isLoading } = response;

    const formStyle = {
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
    };

    return (
        <>
            <Helmet>
                <title>{`Detalhes de a Pagar - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="lg">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes da Conta a Pagar
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>
                                        {/* ID */}
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                ID: {payble?.payableId || "-"}
                                            </Typography>
                                        </Grid>

                                        {/* Status */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Status: {payble?.status || "-"}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Emissão */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data de Emissão: {formatDate(payble?.dataEmissao)}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Emissão */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data do Pagamento: {formatDate(payble?.dataPagamento)}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Vencimento */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data de Vencimento: {formatDate(payble?.dataVencimento)}
                                            </Typography>
                                        </Grid>

                                        {/* Valor Total */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Valor Total: {formatPrice(payble?.totalValue)}
                                            </Typography>
                                        </Grid>

                                        {/* Pagável relacionado a Entry ou Purchase */}
                                        {payble?.entry ? (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Lançamento
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Tipo de Entrada: {payble.entry.type}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Descrição: {payble.entry.description || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Valor: {formatPrice(payble.entry.value)}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        ) : payble?.purchase ? (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Compra
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Descrição da Compra: {payble.purchase.description || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Data da Compra: {formatDate(payble.purchase.date_time)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Desconto: {formatPrice(payble.purchase.discount)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Valor Total da Compra: {formatPrice(payble.purchase.totalPrice)}
                                                    </Typography>
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
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
            </DashboardContent>
        </>
    );
}
