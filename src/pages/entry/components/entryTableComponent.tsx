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
  Box
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useDeleteEntry, useGetExpenseReceipt } from "src/hooks/useEntry";

import { EntryType, type Entry } from "src/models/entry";
import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface ExpenseTableComponentProps {
  expenses: Entry[];
  isLoading: boolean;
  setSelectedExpenses: React.Dispatch<React.SetStateAction<Entry[]>>;
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
  const deleteExpense = useDeleteEntry();
  const notification = useNotification();

  // Função para formatar o valor em R$ (Real)
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
  
    // Adicionar 1 dia
    localDate.setDate(localDate.getDate() + 1);
  
    return localDate.toLocaleDateString("pt-BR");
  };

    // Função para determinar a cor com base no tipo
 // Função para determinar a cor com base no tipo
const getTypeColor = (type: EntryType) => (type === EntryType.ganho ? "#2fba54" : "#f72d2d");

  
  
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

  const handleEditClick = (expenseId: number) => {
    navigate.push(`edit/${expenseId}`);
    handleCloseMenu();
  };

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
        link.download = `RECIBO-DE-CAIXA-${expenseId}.pdf`;
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
      const allIds = expenses.map((e) => e.entryId);
      setSelectedExpenseIds(allIds);
      setSelectedExpenses(expenses);
    } else {
      setSelectedExpenseIds([]);
      setSelectedExpenses([]);
    }
  };

  const handleSelectExpense = (event: React.ChangeEvent<HTMLInputElement>, expense: Entry) => {
    if (event.target.checked) {
      setSelectedExpenseIds((prev) => [...prev, expense.entryId]);
      setSelectedExpenses((prev) => [...prev, expense]);
    } else {
      setSelectedExpenseIds((prev) => prev.filter((id) => id !== expense.entryId));
      setSelectedExpenses((prev) => prev.filter((e) => e.entryId !== expense.entryId));
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
                onChange={(event) => {
                  if (event.target.checked) {
                    const allIds = expenses.map((e) => e.entryId);
                    setSelectedExpenseIds(allIds);
                    setSelectedExpenses(expenses);
                  } else {
                    setSelectedExpenseIds([]);
                    setSelectedExpenses([]);
                  }
                }}
              />
            </TableCell>
            <TableCell>Cód</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Subtipo</TableCell>
            <TableCell>Data</TableCell>
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
            expenses.map((expense) => (
              <TableRow key={expense.entryId}>
                <TableCell>
                  <Checkbox
                    checked={selectedExpenseIds.includes(expense.entryId)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedExpenseIds((prev) => [...prev, expense.entryId]);
                        setSelectedExpenses((prev) => [...prev, expense]);
                      } else {
                        setSelectedExpenseIds((prev) =>
                          prev.filter((id) => id !== expense.entryId)
                        );
                        setSelectedExpenses((prev) =>
                          prev.filter((e) => e.entryId !== expense.entryId)
                        );
                      }
                    }}
                  />
                </TableCell>

                <TableCell>{expense.entryId || "-"}</TableCell>

                {/* Shape colorido para Tipo */}
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 0.5,
                      borderRadius: 8,
                      backgroundColor: getTypeColor(expense.type),
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {expense.type === EntryType.ganho ? "Entrada" : "Saída"}
                  </Box>
                </TableCell>

                <TableCell>{expense.subtype || "-"}</TableCell>

                {/* Data formatada */}
                <TableCell>
                  {expense.date_time ? formatDate(expense.date_time) : "-"}
                </TableCell>

                {/* Valor formatado em R$ */}
                <TableCell>
                  {expense.value !== undefined ? formatPrice(expense.value) : "-"}
                </TableCell>

                {/* Menu de ações */}
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, expense.entryId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === expense.entryId)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => handleDetailsClick(expense.entryId)}>Detalhes</MenuItem>
                    <MenuItem onClick={() => handleEditClick(expense.entryId)}>Editar</MenuItem>
                    <MenuItem onClick={() => handleGenerateReceipt(expense.entryId)}>Gerar Recibo</MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(expense.entryId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg"
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhuma Despesa Cadastrada</p>
                </div>
              </TableCell>
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