import type { Entry, EntryPaginatedParams } from "src/models/entry";

import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Paper from "@mui/material/Paper";
import { Box, Grid } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

import { useDeleteEntry, useGetEntriesPaginated } from "src/hooks/useEntry";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

import EntryTableSearch from "./components/entryTableSearch";
import ExpenseTableComponent from "./components/entryTableComponent";
import EntryTableFooterComponent from "./components/entryTableFooter";
import ExpensesTableHeaderComponent from "./components/entryTableHeaderComponent";

// ----------------------------------------------------------------------

export default function ExpensePage() {
  const [selectedExpenses, setSelectedExpenses] = useState<Entry[]>([]);
  const rowsPerPage = 25;
  const [page, setPage] = useState(0);

  // Estados para filtro por período
  const [getAllParams, setGetAllParams] = useState<EntryPaginatedParams>({
    startDate: null,
    endDate: null,
    subtype: null,
    skip: page * rowsPerPage,
    take: rowsPerPage
  });

  // Dados paginados e filtrados
  const { data: pagedData, isLoading: isPagedLoading } = useGetEntriesPaginated(getAllParams);

  // Determina os dados a exibir (gerais ou filtrados)
  const expenses = pagedData?.data ?? [];

  // Define o estado de carregamento
  const isLoading = isPagedLoading;

  const deleteExpense = useDeleteEntry();
  const notification = useNotification();

  const handleDeleteExpense = () => {
    selectedExpenses.forEach((expense) => {
      deleteExpense.mutate(expense.entryId, {
        onSuccess: () => {
          notification.addNotification("Lançamento deletada com sucesso", "success");
          setSelectedExpenses([]);
        },
        onError: () => {
          notification.addNotification("Erro ao deletar Lançamento, tente novamente mais tarde", "error");
        },
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Lançamentos - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <ExpensesTableHeaderComponent
            title="Lançamentos"
            addButtonName="Criar Lançamento"
            addButtonPath="/expenses/create"
          />
          <Grid item xs={12}>
            <EntryTableSearch
              handleDelete={handleDeleteExpense}
              selectedRows={selectedExpenses}
              setSearchByPeriod={setGetAllParams}
            />

            <TableContainer component={Paper} sx={{ height: "65vh", display: "flex", flexDirection: "column" }}>
              <Box component="div" sx={{ flex: 1, overflow: "auto" }}>
                <ExpenseTableComponent
                  setSelectedExpenses={setSelectedExpenses}
                  expenses={expenses}
                  isLoading={isLoading}
                />
              </Box>

                <EntryTableFooterComponent
                  setPage={setPage}
                  setParams={setGetAllParams}
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
