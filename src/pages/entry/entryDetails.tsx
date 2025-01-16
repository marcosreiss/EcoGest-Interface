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

import { useGetEntryById } from "src/hooks/useExpense";

import { CONFIG } from "src/config-global";
import { EntryType } from "src/models/entry";
import { DashboardContent } from "src/layouts/dashboard";

export default function EntryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const entryId = parseInt(id!, 10);

  const { data: entry, isLoading } = useGetEntryById(entryId); // Reutilizando o hook para buscar entradas

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/entries/edit/${id}`);
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
        <title>{`Detalhes da Lançamento - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            <Grid item xs={6}>
              <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                Detalhes de Lançamento
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box sx={formStyle}>
                  <Grid container spacing={2}>

                    {/* Tipo da Entrada */}
                    <Grid item xs={6}>
                      <Typography variant="h6" gutterBottom>
                        Tipo: {entry?.type === EntryType.ganho ? "Entrada" : "Saída"}
                      </Typography>
                    </Grid>

                    {/* Botão de Editar */}
                    <Grid item xs={6}>
                      <IconButton onClick={handleEditClick}>
                        <img alt="icon" src="/assets/icons/ic-edit.svg" />
                      </IconButton>
                    </Grid>

                    {/* Subtipo */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Subtipo: {entry?.subtype || "-"}
                      </Typography>
                    </Grid>

                    {/* Descrição */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Descrição: {entry?.description || "-"}
                      </Typography>
                    </Grid>

                    {/* Valor formatado */}
                    <Grid item xs={12}>
                      <Typography variant="body1" gutterBottom>
                        Valor: {entry?.value !== undefined ? formatPrice(entry.value) : "-"}
                      </Typography>
                    </Grid>

                    {/* Data e Hora */}
                    {entry?.date_time && (
                      <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                          Data e Hora: {new Date(entry.date_time).toLocaleString("pt-BR")}
                        </Typography>
                      </Grid>
                    )}

                    {/* Data de Criação (createdAt) */}
                    {entry?.createdAt && (
                      <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>
                          Data de Criação: {new Date(entry.createdAt).toLocaleDateString("pt-BR")}
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
