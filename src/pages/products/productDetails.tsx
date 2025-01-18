import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetProductById } from "src/hooks/useProduct";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

// Função para formatar o peso em PT-BR
const formatWeight = (weightKg: number | string | undefined): string => {
    if (weightKg === undefined || weightKg === null) return "-"; // Verifica se o peso é inválido

    const weight = typeof weightKg === "string" ? parseFloat(weightKg) : weightKg; // Converte string para número, se necessário

    const weightInTons = weight / 1000; // Converte para toneladas

    return `${weightInTons.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Toneladas`;
};


// Função para formatar o preço em PT-BR
const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "-";
    const parsedPrice = typeof price === "string" ? parseFloat(price) : price;
    return `R$ ${parsedPrice.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const productId = parseInt(id!, 10);

    const response = useGetProductById(productId);
    const product = response.data;
    const { isLoading } = response;

    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    };
    const navigate = useRouter();
    const handleEditClick = () => {
        navigate.replace(`/products/edit/${id}`);
    };

    return (
        <>
            <Helmet>
                <title>{`Detalhes do Produto - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="lg">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                                Detalhes do Produto
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={formStyle}>
                                    <Grid container spacing={2}>
                                        {/* Nome */}
                                        <Grid item xs={6}>
                                            <Typography variant="h6" gutterBottom>
                                                Nome: {product?.name || "-"}
                                            </Typography>
                                        </Grid>
                                        {/* Botão de Editar */}
                                        <Grid item xs={6}>
                                            <IconButton onClick={handleEditClick}>
                                                <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                            </IconButton>
                                        </Grid>

                                        {/* Quantidade */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Quantidade: {formatWeight(product?.weightAmount)}
                                            </Typography>
                                        </Grid>

                                        {/* Preço */}
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom>
                                                Preço: {formatPrice(product?.price)}
                                            </Typography>
                                        </Grid>
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
