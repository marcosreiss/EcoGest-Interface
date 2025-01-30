import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  Button,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetEntryById } from "src/hooks/useEntry";

import { CONFIG } from "src/config-global";
import { EntryType } from "src/models/entry";
import { DashboardContent } from "src/layouts/dashboard";

export default function EntryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const entryId = parseInt(id!, 10);

  const { data: entry, isLoading } = useGetEntryById(entryId);

  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/entries/edit/${id}`);
  };

  const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const localDate = new Date(date);
    localDate.setDate(localDate.getDate() + 1);
    return localDate.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes do Lançamento - ${CONFIG.appName}`}</title>
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
                Detalhes do Lançamento
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ fontSize: 15 }}
              >
                Editar Lançamento
              </Button>
            </Box>

            <Card elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={3}>
                  {/* Tipo da Entrada */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Tipo
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {entry?.type === EntryType.ganho ? "Entrada" : "Saída"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Subtipo */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Subtipo
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {entry?.subtype || "-"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Descrição */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Descrição
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {entry?.description || "-"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Valor */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Valor
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1">
                        {entry?.value !== undefined ? formatPrice(entry.value) : "-"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Data */}
                  {entry?.date_time && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Data
                      </Typography>
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body1">
                          {formatDate(entry.date_time)}
                        </Typography>
                      </Box>
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
