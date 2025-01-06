import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetExpenseById } from "src/hooks/useExpense";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";

export default function ExpenseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const expenseId = parseInt(id!, 10);

  const { data: expense, isLoading } = useGetExpenseById(expenseId);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/expenses/edit/${id}`);
  };

  // Função para formatar valores numéricos em R$ (Real)
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
        <title>{`Detalhes da Despesa - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Grid item xs={6}>
              <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                Detalhes da Despesa
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box sx={formStyle}>
                  <Grid container spacing={2}>

                    {/* Tipo da Despesa */}
                    <Grid item xs={6}>
                      <Typography variant="h6" gutterBottom>
                        Tipo: {expense?.type || "-"}
                      </Typography>
                    </Grid>

                    {/* Botão de Editar */}
                    <Grid item xs={6}>
                      <IconButton onClick={handleEditClick}>
                        <img alt="icon" src="/assets/icons/ic-edit.svg" />
                      </IconButton>
                    </Grid>

                    {/* Descrição */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Descrição: {expense?.description || "-"}
                      </Typography>
                    </Grid>

                    {/* Preço formatado */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Preço:{" "}
                        {expense?.price !== undefined
                          ? formatPrice(expense.price)
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* Funcionário */}
                    {expense?.employeeId && (
                      <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                          ID do Funcionário: {expense.employeeId}
                        </Typography>
                      </Grid>
                    )}

                    {/* ID da Compra */}
                    {expense?.purchasesId && (
                      <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                          ID da Compra: {expense.purchasesId}
                        </Typography>
                      </Grid>
                    )}

                    {/* Data de Criação (createdAt) */}
                    {expense?.createdAt && (
                      <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                          Data:{" "}
                          {new Date(expense.createdAt).toLocaleDateString("pt-BR")}
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
