import type { Sale } from "src/models/sale";

import React, { useState } from "react";

import {
  Menu,
  Table,
  Select,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  LinearProgress,
  MenuItem as MuiMenuItem,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useDeleteSale, useGetSaleReceipt, useUpdateSaleStatus } from "src/hooks/useSales";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface TableComponentProps {
  sales: Sale[];
  isLoading: boolean;
  setSelectedSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  sortOrder?: "asc" | "desc";
}

const SaleTableComponent: React.FC<TableComponentProps> = ({
  sales,
  isLoading,
  setSelectedSales,
  sortOrder = "asc",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSaleIds, setSelectedSaleIds] = useState<number[]>([]);

  const { data: receipt, refetch: fetchReceipt } = useGetSaleReceipt(selectedItem || 0);

  const navigate = useRouter();
  const deleteSale = useDeleteSale();
  const updateSaleStatus = useUpdateSaleStatus();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, saleId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(saleId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (saleId: number) => {
    navigate.push(`details/${saleId}`);
    handleClose();
  };

  const handleEditClick = (saleId: number) => {
    navigate.push(`edit/${saleId}`);
    handleClose();
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

  const handleGenerateReceipt = async (saleId: number) => {
    try {
      await fetchReceipt(); // Requisição para obter o recibo
      if (receipt) {
        const url = window.URL.createObjectURL(receipt);
        const link = document.createElement("a");
        link.href = url;
        link.download = `receipt-${saleId}.pdf`;
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

  const handleStatusChange = (saleId: number, newStatus: 'processing' | 'approved' | 'canceled') => {
    updateSaleStatus.mutate({ id: saleId, saleStatus: newStatus }, {
      onSuccess: () => {
        notification.addNotification("Status da venda atualizado com sucesso", "success");
      },
      onError: () => {
        notification.addNotification("Erro ao atualizar o status da venda", "error");
      },
    });
  };

  const sortedSales = React.useMemo(() => {
    if (!sales) return [];
    return [...sales].sort((a, b) => {
      const dateA = new Date(a.date_time).getTime();
      const dateB = new Date(b.date_time).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [sales, sortOrder]);

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
            <TableCell sx={{ width: "30%", minWidth: "150px" }}>Produto</TableCell>
            <TableCell sx={{ width: "30%", minWidth: "150px" }}>Cliente</TableCell>
            <TableCell sx={{ width: "20%", minWidth: "100px" }}>Data</TableCell>
            <TableCell sx={{ width: "15%", minWidth: "100px" }}>Status</TableCell>
            <TableCell sx={{ width: "5%" }}> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : sortedSales.length > 0 ? (
            sortedSales.map((sale) => (
              <TableRow key={sale.saleId}>
                <TableCell>
                  <Checkbox
                    checked={selectedSaleIds.includes(sale.saleId)}
                    onChange={(e) => handleSelectSale(e, sale)}
                  />
                </TableCell>
                <TableCell>{sale.product?.name || "N/A"}</TableCell>
                <TableCell>{sale.customer?.name || "N/A"}</TableCell>
                <TableCell>
                  {new Date(sale.date_time).toLocaleDateString() || "N/A"}
                </TableCell>
                <TableCell>
                  {sale.saleStatus === "processing" ? (
                    <Select
                      value={sale.saleStatus}
                      onChange={(e) => handleStatusChange(sale.saleId, e.target.value as 'processing' | 'approved' | 'canceled')}
                    >
                      <MuiMenuItem value="processing">Processando</MuiMenuItem>
                      <MuiMenuItem value="approved">Aprovada</MuiMenuItem>
                      <MuiMenuItem value="canceled">Cancelada</MuiMenuItem>
                    </Select>
                  ) : (
                    sale.saleStatus === "approved"
                      ? "Aprovada"
                      : "Cancelada"
                  )}
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
                    {sale.saleStatus === "processing" && (
                      <MenuItem onClick={() => handleEditClick(sale.saleId)}>
                        Editar
                      </MenuItem>
                    )}
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
              <TableCell colSpan={6}>Nenhuma venda encontrada.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
