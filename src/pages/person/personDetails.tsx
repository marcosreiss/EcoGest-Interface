import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Card,
  Button,
  Divider,
  Typography,
  CardContent,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useGetPersonById } from "src/hooks/usePerson";

import { CONFIG } from "src/config-global";
import { PersonType } from "src/models/person";
import { DashboardContent } from "src/layouts/dashboard";

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const personId = parseInt(id!, 10);
  const { data: person, isLoading } = useGetPersonById(personId);
  const navigate = useRouter();

  const handleEditClick = () => {
    navigate.replace(`/person/edit/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>{`Detalhes da Pessoa - ${CONFIG.appName}`}</title>
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
                Detalhes do{" "}
                {person?.type === PersonType.cliente ? "Cliente" : "Fornecedor"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditClick}
                sx={{ fontSize: 15 }}
              >
                Editar
              </Button>
            </Box>

            <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  {/* Informações Básicas */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Informações Básicas
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Nome:</strong> {person?.name || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>
                          {person?.type === "fornecedor" ? "CNPJ" : "CPF"}:
                        </strong>{" "}
                        {person?.cpfCnpj || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Contato:</strong> {person?.contact || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {person?.email || "-"}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Observação:</strong>{" "}
                        {person?.obs || "Não informado"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Endereço */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Endereço
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>CEP:</strong> {person?.address?.cep || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Cidade:</strong>{" "}
                        {person?.address?.cidade || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>UF:</strong> {person?.address?.uf || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Bairro:</strong> {person?.address?.bairro || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Endereço:</strong>{" "}
                        {person?.address?.endereco || "-"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Número:</strong> {person?.address?.numero || "-"}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Complemento:</strong>{" "}
                        {person?.address?.complemento || "Não informado"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
              </CardContent>
            </Card>
          </>
        )}
      </DashboardContent>
    </>
  );
}
