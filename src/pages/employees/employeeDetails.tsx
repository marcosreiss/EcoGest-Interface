import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography, IconButton, LinearProgress } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useGetEmployeeById } from "src/hooks/useEmployee";
import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function EmployeeDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const employeeId = parseInt(id!, 10);

    const { data, isLoading } = useGetEmployeeById(employeeId);

    // Acessando o dado encapsulado dentro de "data"
    const employee = data?.data;

    const formStyle = {
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
    };

    const navigate = useRouter();
    const handleEditClick = () => {
        navigate.replace(`/employees/edit/${id}`);
    };

    const formatCurrency = (value: string | number | null | undefined) => {
        if (!value) return "-";
        return `R$ ${parseFloat(value.toString()).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return "-";
        if (date instanceof Date) {
            return date.toLocaleDateString("pt-BR");
        }
        return new Date(date).toLocaleDateString("pt-BR");
    };
    

    return (
        <>
            <Helmet>
                <title>{`Detalhes do Funcionário - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent maxWidth="md">
                {isLoading ? (
                    <LinearProgress />
                ) : (
                    <Grid container>
                        <Grid item xs={12}>
                            <Box sx={formStyle}>
                                <Grid container spacing={2}>
                                    {/* Nome */}
                                    <Grid item xs={6}>
                                        <Typography variant="h6" gutterBottom>
                                            Nome: {employee?.nome || "-"}
                                        </Typography>
                                    </Grid>
                                    {/* Botão de Editar */}
                                    <Grid item xs={6}>
                                        <IconButton onClick={handleEditClick}>
                                            <img alt="icon" src="/assets/icons/ic-edit.svg" />
                                        </IconButton>
                                    </Grid>

                                    {/* Registro Número */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Registro Número: {employee?.registroNumero || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* RG */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            RG: {employee?.rg || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* CPF */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            CPF: {employee?.cpf || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* Endereço */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Endereço: {employee?.endereco || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* Contato */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Contato: {employee?.contato || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* Função */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Função: {employee?.funcao || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* Salário */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Salário: {formatCurrency(employee?.salario)}
                                        </Typography>
                                    </Grid>

                                    {/* Data de Admissão */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Data de Admissão: {formatDate(employee?.dataAdmissao)}
                                        </Typography>
                                    </Grid>

                                    {/* Data de Demissão */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Data de Demissão: {formatDate(employee?.dataDemissao)}
                                        </Typography>
                                    </Grid>

                                    {/* Período de Férias */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Período de Férias: {employee?.periodoFerias || "-"}
                                        </Typography>
                                    </Grid>

                                    {/* Data de Pagamento */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Data de Pagamento: {formatDate(employee?.dataDePagamento)}
                                        </Typography>
                                    </Grid>

                                    {/* Status */}
                                    <Grid item xs={12}>
                                        <Typography variant="body1" gutterBottom>
                                            Status: {employee?.status || "-"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </DashboardContent>
        </>
    );
}
