import type { Sale } from "src/models/sale";

import React, { useState } from "react";

import {
  Menu,
  Table,
  Select,
  Dialog,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useDeleteSale, useGetSaleReceipt, useUpdateSaleStatus } from "src/hooks/useSales";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface TableComponentProps {
  sales: Sale[];
  isLoading: boolean;
  setSelectedSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const SaleTableComponent: React.FC<TableComponentProps> = ({
  sales,
  isLoading,
  setSelectedSales,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'processing' | 'approved' | 'canceled'>("processing");
  const [selectedSaleIds, setSelectedSaleIds] = useState<number[]>([]);

  const { data: receipt, refetch: fetchReceipt } = useGetSaleReceipt(selectedItem || 0);

  const navigate = useRouter();
  const deleteSale = useDeleteSale();
  const updateSaleStatus = useUpdateSaleStatus();
  const notification = useNotification();

  // Função para formatar o valor em R$ (Real)
  const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para formatar a data no formato pt-BR
  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("pt-BR");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, saleId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(saleId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmStatusChange = () => {
    if (selectedItem !== null) {
      updateSaleStatus.mutate(
        { id: selectedItem, saleStatus: newStatus },
        {
          onSuccess: () => {
            notification.addNotification("Status da venda atualizado com sucesso", "success");
            setStatusModalOpen(false);
          },
          onError: () => {
            notification.addNotification("Erro ao atualizar o status da venda", "error");
          },
        }
      );
    }
  };

  const handleDetailsClick = (saleId: number) => {
    navigate.push(`details/${saleId}`);
    handleClose();
  };

  const handleEditClick = (saleId: number) => {
    navigate.push(`edit/${saleId}`);
    handleClose();
  };

  const handleGenerateReceipt = async (saleId: number) => {
    try {
      await fetchReceipt(); // Requisição para obter o recibo
      if (receipt) {
        const url = window.URL.createObjectURL(receipt);
        const link = document.createElement("a");
        link.href = url;
        link.download = `RECIBO-DE-VENDA-${saleId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        notification.addNotification("Recibo gerado com sucesso", "success");
      }
    } catch (error) {
      notification.addNotification("Erro ao gerar o recibo", "error");
    } finally {
      handleClose();
    }
  };

  const handleDeleteClick = (saleId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(saleId);
  };

  const handleDeleteSale = (saleId: number) => {
    handleClose();
    deleteSale.mutate(saleId, {
      onSuccess: () => {
        notification.addNotification("Venda deletada com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification(
          "Erro ao deletar venda, tente novamente mais tarde",
          "error"
        );
      },
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = sales.map((s) => s.saleId);
      setSelectedSaleIds(allIds);
      setSelectedSales(sales);
    } else {
      setSelectedSaleIds([]);
      setSelectedSales([]);
    }
  };

  const handleSelectSale = (
    event: React.ChangeEvent<HTMLInputElement>,
    sale: Sale
  ) => {
    if (event.target.checked) {
      setSelectedSaleIds((prev) => [...prev, sale.saleId]);
      setSelectedSales((prev) => [...prev, sale]);
    } else {
      setSelectedSaleIds((prev) => prev.filter((id) => id !== sale.saleId));
      setSelectedSales((prev) => prev.filter((s) => s.saleId !== sale.saleId));
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="sales table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={
                  sales.length > 0 && selectedSaleIds.length === sales.length
                }
                indeterminate={
                  selectedSaleIds.length > 0 &&
                  selectedSaleIds.length < sales.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Cód</TableCell>
            <TableCell>Cliente</TableCell> {/* Nova coluna para o cliente */}
            <TableCell>Descrição</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : sales.length > 0 ? (
            sales.map((sale) => (
              <TableRow key={sale.saleId}>
                <TableCell>
                  <Checkbox
                    checked={selectedSaleIds.includes(sale.saleId)}
                    onChange={(e) => handleSelectSale(e, sale)}
                  />
                </TableCell>
                <TableCell>{sale.saleId}</TableCell>
                <TableCell>{sale.customer?.name || "Cliente não informado"}</TableCell> {/* Exibindo o cliente vinculado */}
                <TableCell>{sale.description}</TableCell>
                <TableCell>
                  {sale.date_time ? formatDate(sale.date_time) : "N/A"}
                </TableCell>
                <TableCell>
                  {sale.totalPrice !== undefined
                    ? formatPrice(sale.totalPrice)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, sale.saleId)}>
                    ︙
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === sale.saleId)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleDetailsClick(sale.saleId)}>
                      Detalhes
                    </MenuItem>
                    <MenuItem onClick={() => handleEditClick(sale.saleId)}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleGenerateReceipt(sale.saleId)}>
                      Gerar Recibo
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(sale.saleId)}>
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg"
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhuma Venda Cadastrada</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      {/* Dialog para Atualizar Status */}
      <Dialog open={statusModalOpen} onClose={handleCloseStatusModal}>
        <DialogTitle>Atualizar Status</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as 'processing' | 'approved' | 'canceled')}
          >
            <MenuItem value="processing">Processando</MenuItem>
            <MenuItem value="approved">Aprovada</MenuItem>
            <MenuItem value="canceled">Cancelada</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal}>Cancelar</Button>
          <Button onClick={handleConfirmStatusChange} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação para Deletar */}
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar a venda?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleClose();
        }}
        onConfirm={() => selectedItem && handleDeleteSale(selectedItem)}
        title="Deletar Venda"
      />
    </>
  );
};

export default SaleTableComponent;
