import type { Receive } from "src/models/receive";

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
import { EntityType, type FilterParams } from "src/models/filterParams";

import TableFooterComponent from "src/components/table/tableFooterComponent";
import FilterTableComponent from "src/components/table/filterTableComponent";

import ReciveTableComponent from "./components/reciveTableComponent";

// ----------------------------------------------------------------------

export default function RecivePage() {
  const [selectedRecives, setSelectedRecives] = useState<Receive[]>([]);
  const rowsPerPage = 25;
  const [page, setPage] = useState(0);
  const [receiveParams, setReceiveParams] = useState<FilterParams>({
    skip: 0, // Início padrão
    take: rowsPerPage,
    startDate: null,
    endDate: null,
    id: null,
    personId: null,
    nfe: null,
    order: "desc",
    dataVencimento: null,
    status: null,
  });

  // Dados paginados
  const { data: pagedData, isLoading: isPagedLoading } = useGetRecivesPaged(receiveParams);

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
        <title>{`Contas a receber - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
              Contas a Receber
            </Typography>
          </Grid>
          <Grid item xs={12}>
            
            <FilterTableComponent 
              entityType={EntityType.receive}
              handleDelete={handleDeleteRecive}
              selectedRows={selectedRecives}
              setParams={setReceiveParams}
              status={receiveParams.status}
              dataVencimento={receiveParams.dataVencimento}
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
