import type { Payble, PayableParams } from "src/models/payable";

import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Paper from "@mui/material/Paper";
import { Box, Grid, Typography } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

import { useDeletePayble, useGetPayblesPaged } from "src/hooks/usePayble";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

import PaybleTableSearch from "./components/payableTableSearch";
import PaybleTableComponent from "./components/payableTableComponent";
import TableFooterComponent from "../../layouts/components/tableFooterComponent";

// ----------------------------------------------------------------------

export default function PayableIndex() {
  const [selectedPaybles, setSelectedPaybles] = useState<Payble[]>([]);
  const rowsPerPage = 25;
  const [page, setPage] = useState(0);
  const [searchByPeriod, setSearchByPeriod] = useState<PayableParams>({
    skip: page * rowsPerPage,
    take: rowsPerPage,
    startDate: null,
    endDate: null,
    status: null,
  });

  // Dados paginados
  const { data: pagedData, isLoading: isPagedLoading } = useGetPayblesPaged(searchByPeriod);

  const paybles = pagedData?.data ?? [];

  // Define o estado de carregamento
  const isLoading = isPagedLoading;

  const deletePayble = useDeletePayble();
  const notification = useNotification();

  const handleDeletePayble = () => {
    selectedPaybles.forEach((payble) => {
      deletePayble.mutate(payble.payableId, {
        onSuccess: () => {
          notification.addNotification("Pagável deletado com sucesso", "success");
          setSelectedPaybles([]);
        },
        onError: () => {
          notification.addNotification(
            "Erro ao deletar pagável, tente novamente mais tarde",
            "error"
          );
        },
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Contas a pagar - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
              Contas a Pagar
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <PaybleTableSearch
              handleDelete={handleDeletePayble}
              selectedRows={selectedPaybles}
              setSearchByPeriod={setSearchByPeriod}
              isSearchDisabled={false}
              handleSearchChange={() => null} // Não utilizado no componente
            />

            <TableContainer
              component={Paper}
              sx={{ height: "65vh", display: "flex", flexDirection: "column" }}
            >
              <Box component="div" sx={{ flex: 1, overflow: "auto" }}>
                <PaybleTableComponent
                  setSelectedPaybles={setSelectedPaybles}
                  paybles={paybles}
                  isLoading={isLoading}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={pagedData?.meta?.totalItems || 0}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
