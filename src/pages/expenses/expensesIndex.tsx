import type { Expense } from "src/models/expense";

import * as React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Paper from "@mui/material/Paper";
import { Box, Grid } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

import { useDeleteExpense, useGetExpensesPaginated } from "src/hooks/useExpense";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import TableSearch from "src/layouts/components/tableSearch";
import { useNotification } from "src/context/NotificationContext";
import TableFooterComponent from "src/layouts/components/tableFooterComponent";

import ExpenseTableComponent from "./components/expenseTableComponent";
import ExpensesTableHeaderComponent from "./components/expensesTableHeaderComponent";

// ----------------------------------------------------------------------

export default function ExpensePage() {
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetExpensesPaginated(page * rowsPerPage, rowsPerPage);

  const expenses = data?.data || [];

  const deleteExpense = useDeleteExpense();
  const notification = useNotification();

  const handleDeleteExpense = () => {
    selectedExpenses.forEach((expense) => {
      deleteExpense.mutate(expense.expenseId, {
        onSuccess: () => {
          notification.addNotification("Despesa deletada com sucesso", "success");
          setSelectedExpenses([]); // Limpa a seleção após a exclusão
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
            <TableSearch
              handleDelete={handleDeleteExpense}
              handleSearchChange={() => null} // Pesquisa desativada
              isSearchDisabled
              selectedRows={selectedExpenses}
            />
            <TableContainer component={Paper} sx={{ height: "65vh", display: "flex", flexDirection: "column" }}>
              <Box component="div" sx={{ flex: 1, overflow: "auto" }}>
                <ExpenseTableComponent
                  setSelectedExpenses={setSelectedExpenses}
                  expenses={expenses}
                  isLoading={isLoading}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={data?.meta.totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
