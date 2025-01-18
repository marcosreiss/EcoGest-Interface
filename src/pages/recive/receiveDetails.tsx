import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetReceiveById } from "src/hooks/useReceive";

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
const formatDate = (date?: string | Date): string => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
};

export default function ReceiveDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const receiveId = parseInt(id!, 10);

    const response = useGetReceiveById(receiveId);
    const receive = response.data;
    const { isLoading } = response;

    const formStyle = {
        mx: "auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
    };

    const navigate = useRouter();
    const handleEditClick = () => {
        navigate.replace(`/receives/edit/${id}`);
    };
    return (
        <>
            <Helmet>
                <title>{`Detalhes de a Receber - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="lg">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes da Conta a Receber
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>
                                        {/* ID */}
                                        <Grid item xs={6}>
                                            <Typography variant="body1" gutterBottom>
                                                ID: {receive?.receiveId || "-"}
                                            </Typography>
                                        </Grid>
                                        {/* Botão de Editar */}
                                        <Grid item xs={6}>
                                            <IconButton onClick={handleEditClick}>
                                                <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                            </IconButton>
                                        </Grid>

                                        {/* Status */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Status: {receive?.status || "-"}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Emissão */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data de Emissão: {formatDate(receive?.dataEmissao)}
                                            </Typography>
                                        </Grid>

                                        {/* Data de Vencimento */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Data de Vencimento: {formatDate(receive?.dataVencimento)}
                                            </Typography>
                                        </Grid>

                                        {/* Valor Pago */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Valor Pago: {formatPrice(receive?.payedValue)}
                                            </Typography>
                                        </Grid>

                                        {/* Valor Total */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Valor Total: {formatPrice(receive?.totalValue)}
                                            </Typography>
                                        </Grid>

                                        {/* Recebimento relacionado a Entry ou Sale */}
                                        {receive?.entry ? (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Lançamento
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Tipo de Entrada: {receive.entry.type}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Subtipo: {receive.entry.subtype || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Descrição: {receive.entry.description || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Valor: {formatPrice(receive.entry.value)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Data e Hora: {formatDate(receive.entry.date_time)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Criado em: {formatDate(receive.entry.createdAt)}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        ) : receive?.sale ? (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Venda
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        ID da Venda: {receive.sale.saleId || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        ID da Pessoa: {receive.sale.personId || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Data e Hora: {formatDate(receive.sale.date_time)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Descrição: {receive.sale.description || "-"}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Desconto: {formatPrice(receive.sale.discount)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body1" gutterBottom>
                                                        Preço Total: {formatPrice(receive.sale.totalPrice)}
                                                    </Typography>
                                                </Grid>
                                                {/*  <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom>
                                                        Produtos
                                                    </Typography>
                                                </Grid>
                                                 {receive.sale.products.map((saleProduct, index) => (
                                                    <Grid container key={index} spacing={1} sx={{ mb: 2 }}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" gutterBottom>
                                                                Produto: {saleProduct.product.name || "-"}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Typography variant="body2" gutterBottom>
                                                                Quantidade: {saleProduct.quantity}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={3}>
                                                            <Typography variant="body2" gutterBottom>
                                                                Preço Total: {formatPrice(saleProduct.totalPrice)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ))} */}
                                            </>
                                        ) : (
                                            <Grid item xs={12}>
                                                <Typography variant="body1" gutterBottom>
                                                    Nenhuma entrada ou venda associada.
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

