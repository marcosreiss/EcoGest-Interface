import React, { useState } from "react";

import {
  Menu,
  Table,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useDeleteExpense, useGetExpenseReceipt } from "src/hooks/useExpense";

import { type Expense } from "src/models/expense";
import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface ExpenseTableComponentProps {
  expenses: Expense[];
  isLoading: boolean;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseTableComponent: React.FC<ExpenseTableComponentProps> = ({
  expenses,
  isLoading,
  setSelectedExpenses,
}) => {
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: receipt, refetch: fetchReceipt } = useGetExpenseReceipt(selectedItem || 0);

  const navigate = useRouter();
  const deleteExpense = useDeleteExpense();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, expenseId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(expenseId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (expenseId: number) => {
    navigate.push(`details/${expenseId}`);
    handleCloseMenu();
  };

  // const handleEditClick = (expenseId: number) => {
  //   navigate.push(`edit/${expenseId}`);
  //   handleCloseMenu();
  // };

  const handleDeleteClick = (expenseId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(expenseId);
  };

  const handleDeleteExpense = (expenseId: number) => {
    handleCloseMenu();
    deleteExpense.mutate(expenseId, {
      onSuccess: () => {
        notification.addNotification("Despesa deletada com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification("Erro ao deletar despesa, tente novamente mais tarde", "error");
      },
    });
  };

  const handleGenerateReceipt = async (expenseId: number) => {
    try {
      await fetchReceipt(); // Requisição para obter o recibo
      if (receipt) {
        const url = window.URL.createObjectURL(receipt);
        const link = document.createElement("a");
        link.href = url;
        link.download = `receipt-${expenseId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        notification.addNotification("Recibo gerado com sucesso", "success");
      }
    } catch (error) {
      notification.addNotification("Erro ao gerar o recibo", "error");
    } finally {
      handleCloseMenu();
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = expenses.map((e) => e.expenseId);
      setSelectedExpenseIds(allIds);
      setSelectedExpenses(expenses);
    } else {
      setSelectedExpenseIds([]);
      setSelectedExpenses([]);
    }
  };

  const handleSelectExpense = (event: React.ChangeEvent<HTMLInputElement>, expense: Expense) => {
    if (event.target.checked) {
      setSelectedExpenseIds((prev) => [...prev, expense.expenseId]);
      setSelectedExpenses((prev) => [...prev, expense]);
    } else {
      setSelectedExpenseIds((prev) => prev.filter((id) => id !== expense.expenseId));
      setSelectedExpenses((prev) => prev.filter((e) => e.expenseId !== expense.expenseId));
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="expenses table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%" }}>
              <Checkbox
                checked={expenses.length > 0 && selectedExpenseIds.length === expenses.length}
                indeterminate={selectedExpenseIds.length > 0 && selectedExpenseIds.length < expenses.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedExpenseIds.includes(expense.expenseId)}
                    onChange={(e) => handleSelectExpense(e, expense)}
                  />
                </TableCell>
                <TableCell>{expense.description || "-"}</TableCell>
                <TableCell>{expense.type}</TableCell>
                <TableCell>{`R$${Number(expense.price).toFixed(2)}`}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, expense.expenseId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === expense.expenseId)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => handleDetailsClick(expense.expenseId)}>Detalhes</MenuItem>
                    {/* <MenuItem onClick={() => handleEditClick(expense.expenseId)}>Editar</MenuItem> */}
                    <MenuItem onClick={() => handleGenerateReceipt(expense.expenseId)}>Gerar Recibo</MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(expense.expenseId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>Nenhum dado disponível</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que deseja deletar a despesa?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleCloseMenu();
        }}
        onConfirm={() => selectedItem && handleDeleteExpense(selectedItem)}
        title="Deletar Despesa"
      />
    </>
  );
};

export default ExpenseTableComponent;
