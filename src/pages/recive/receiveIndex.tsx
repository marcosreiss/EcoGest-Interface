import type { Receive, ReceiveParams } from "src/models/receive";

import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Paper from "@mui/material/Paper";
import { Box, Grid, Typography } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

import { useDeleteRecive, useGetRecivesPaged } from "src/hooks/useReceive";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";
import TableFooterComponent from "src/layouts/components/tableFooterComponent";

import ReceiveTableSearch from "./components/receiveTableSearch";
import ReciveTableComponent from "./components/reciveTableComponent";

// ----------------------------------------------------------------------

export default function RecivePage() {
  const [selectedRecives, setSelectedRecives] = useState<Receive[]>([]);
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const [searchByPeriod, setSearchByPeriod] = useState<ReceiveParams>(
    { skip: page * rowsPerPage,
      take: rowsPerPage,
      startDate: null,
      endDate: null,
      status: null});

  // Dados paginados
  const { data: pagedData, isLoading: isPagedLoading } = useGetRecivesPaged(searchByPeriod);

  const recives = pagedData?.data ?? [];

  // Define o estado de carregamento
  const isLoading = isPagedLoading;

  const deleteRecive = useDeleteRecive();
  const notification = useNotification();

  const handleDeleteRecive = () => {
    selectedRecives.forEach((recive) => {
      deleteRecive.mutate(recive.receiveId, {
        onSuccess: () => {
          notification.addNotification("Recebível deletado com sucesso", "success");
          setSelectedRecives([]);
        },
        onError: () => {
          notification.addNotification(
            "Erro ao deletar recebível, tente novamente mais tarde",
            "error"
          );
        },
      });
    });
  };
  
  return (
    <>
      <Helmet>
        <title>{`Recebíveis - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
              Contas a Receber
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ReceiveTableSearch
              handleDelete={handleDeleteRecive}
              selectedRows={selectedRecives}
              isSearchDisabled={false}
              setSearchByPeriod={setSearchByPeriod}
              handleSearchChange={() => null} // Opcional, dependendo da lógica de busca
            />

            <TableContainer
              component={Paper}
              sx={{ height: "65vh", display: "flex", flexDirection: "column" }}
            >
              <Box component="div" sx={{ flex: 1, overflow: "auto" }}>
                <ReciveTableComponent
                  setSelectedRecives={setSelectedRecives}
                  recives={recives}
                  isLoading={isLoading}
                  isSearching={false}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={pagedData?.meta.totalItems || 0}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
