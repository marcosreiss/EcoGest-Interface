import type { Entry } from "src/models/entry";
import type { SearchByPeriodRequest } from "src/models/sale";

import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Paper from "@mui/material/Paper";
import { Box, Grid } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

import { useDeleteEntry, useGetEntriesPaginated, useSearchExpensesByPeriod } from "src/hooks/useExpense";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";
import TableFooterComponent from "src/layouts/components/tableFooterComponent";

import SalesTableSearch from "../sales/components/salesTableSearch";
import ExpenseTableComponent from "./components/expenseTableComponent";
import ExpensesTableHeaderComponent from "./components/expensesTableHeaderComponent";

// ----------------------------------------------------------------------

export default function ExpensePage() {
  const [selectedExpenses, setSelectedExpenses] = useState<Entry[]>([]);
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  // Estados para filtro por período
  const [searchByPeriodRequest, setSearchByPeriod] = useState<SearchByPeriodRequest>({
    startDate: null,
    endDate: null,
  });

  // Dados paginados e filtrados
  const { data: pagedData, isLoading: isPagedLoading } = useGetEntriesPaginated(page * rowsPerPage, rowsPerPage);
  const { data: filteredData, isLoading: isFilteredLoading } = useSearchExpensesByPeriod(searchByPeriodRequest);

  // Determina os dados a exibir (gerais ou filtrados)
  const expenses = searchByPeriodRequest.startDate && searchByPeriodRequest.endDate
    ? filteredData ?? []
    : pagedData?.data ?? [];

  // Define o estado de carregamento
  const isLoading = isFilteredLoading || isPagedLoading;

  const deleteExpense = useDeleteEntry();
  const notification = useNotification();

  const handleDeleteExpense = () => {
    selectedExpenses.forEach((expense) => {
      deleteExpense.mutate(expense.entryId, {
        onSuccess: () => {
          notification.addNotification("Despesa deletada com sucesso", "success");
          setSelectedExpenses([]);
        },
        onError: () => {
          notification.addNotification("Erro ao deletar despesa, tente novamente mais tarde", "error");
        },
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Despesas - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <ExpensesTableHeaderComponent
            title="Despesas"
            addButtonName="Cadastrar Despesa"
            addButtonPath="/expenses/create"
          />
          <Grid item xs={12}>
            <SalesTableSearch
              handleDelete={handleDeleteExpense}
              selectedRows={selectedExpenses}
              setSearchByPeriod={setSearchByPeriod}
              isSearchDisabled={false}
              handleSearchChange={() => null} // Não utilizado no novo componente
            />

            <TableContainer component={Paper} sx={{ height: "65vh", display: "flex", flexDirection: "column" }}>
              <Box component="div" sx={{ flex: 1, overflow: "auto" }}>
                <ExpenseTableComponent
                  setSelectedExpenses={setSelectedExpenses}
                  expenses={expenses}
                  isLoading={isLoading}
                />
              </Box>

              {filteredData === undefined && (
                <TableFooterComponent
                  setPage={setPage}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalItems={pagedData?.meta?.totalItems || 0}
                />
              )}
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
