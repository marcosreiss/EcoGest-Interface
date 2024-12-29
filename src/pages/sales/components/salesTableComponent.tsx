import type { Sale } from "src/models/sale";

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

import { useDeleteSale } from "src/hooks/useSales";

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

  const [selectedSaleIds, setSelectedSaleIds] = useState<number[]>([]);

  const navigate = useRouter();
  const deleteSale = useDeleteSale();
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

  return (
    <>
      <Table stickyHeader aria-label="sales table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={sales.length > 0 && selectedSaleIds.length === sales.length}
                indeterminate={
                  selectedSaleIds.length > 0 && selectedSaleIds.length < sales.length
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
          ) : sales.length > 0 ? (
            sales.map((sale) => (
              <TableRow key={sale.saleId}>
                <TableCell>
                  <Checkbox
                    checked={selectedSaleIds.includes(sale.saleId)}
                    onChange={(e) => handleSelectSale(e, sale)}
                  />
                </TableCell>
                <TableCell>{sale.product.name || "-"}</TableCell>
                <TableCell>{sale.customer.name || "-"}</TableCell>
                <TableCell>{new Date(sale.date_time).toLocaleDateString() || "-"}</TableCell>
                <TableCell>
                  {sale.saleStatus === "processing"
                    ? "Processando"
                    : sale.saleStatus === "approved"
                    ? "Aprovada"
                    : "Cancelada"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, sale.saleId)}>︙</IconButton>
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
                    {sale.saleStatus === 'processing' && (
                        <MenuItem onClick={() => handleEditClick(sale.saleId)}>
                        Editar
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleDeleteClick(sale.saleId)}>
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No data available</TableCell>
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
