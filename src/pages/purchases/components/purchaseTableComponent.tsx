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

import { useDeletePurchase, useUpdatePurchaseStatus } from "src/hooks/usePurchase";

import { useNotification } from "src/context/NotificationContext";
import { type Purchase, PurchaseStatus, purchaseStatusMapping } from "src/models/purchase";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface PurchaseTableComponentProps {
  purchases: Purchase[];
  isLoading: boolean;
  setSelectedPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
}

const PurchaseTableComponent: React.FC<PurchaseTableComponentProps> = ({
  purchases,
  isLoading,
  setSelectedPurchases,
}) => {
  const [selectedPurchaseIds, setSelectedPurchaseIds] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useRouter();
  const deletePurchase = useDeletePurchase();
  const updatePurchaseStatus = useUpdatePurchaseStatus();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, purchaseId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(purchaseId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (purchaseId: number) => {
    navigate.push(`details/${purchaseId}`);
    handleCloseMenu();
  };

  const handleEditClick = (purchaseId: number) => {
    navigate.push(`edit/${purchaseId}`);
    handleCloseMenu();
  };

  const handleViewDocumentClick = (paymentSlip: { data: number[] } | null) => {
    if (paymentSlip) {
      const blob = new Blob([new Uint8Array(paymentSlip.data)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const handleDeleteClick = (purchaseId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(purchaseId);
  };

  const handleDeletePurchase = (purchaseId: number) => {
    handleCloseMenu();
    deletePurchase.mutate(purchaseId, {
      onSuccess: () => {
        notification.addNotification("Compra deletada com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification("Erro ao deletar compra, tente novamente mais tarde", "error");
      },
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = purchases.map((p) => p.purchaseId);
      setSelectedPurchaseIds(allIds);
      setSelectedPurchases(purchases);
    } else {
      setSelectedPurchaseIds([]);
      setSelectedPurchases([]);
    }
  };

  const handleSelectPurchase = (event: React.ChangeEvent<HTMLInputElement>, purchase: Purchase) => {
    if (event.target.checked) {
      setSelectedPurchaseIds((prev) => [...prev, purchase.purchaseId]);
      setSelectedPurchases((prev) => [...prev, purchase]);
    } else {
      setSelectedPurchaseIds((prev) => prev.filter((id) => id !== purchase.purchaseId));
      setSelectedPurchases((prev) => prev.filter((p) => p.purchaseId !== purchase.purchaseId));
    }
  };

  const handleStatusChange = (purchaseId: number, newStatus: PurchaseStatus) => {
    updatePurchaseStatus.mutate(
      { id: purchaseId, purchaseStatus: newStatus },
      {
        onSuccess: () => {
          notification.addNotification("Status da compra atualizado com sucesso", "success");
        },
        onError: () => {
          notification.addNotification("Erro ao atualizar o status da compra", "error");
        },
      }
    );
  };

  return (
    <>
      <Table stickyHeader aria-label="purchases table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%" }}>
              <Checkbox
                checked={purchases.length > 0 && selectedPurchaseIds.length === purchases.length}
                indeterminate={selectedPurchaseIds.length > 0 && selectedPurchaseIds.length < purchases.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Fornecedor</TableCell>
            <TableCell>Produto</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Preço</TableCell>
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
          ) : purchases.length > 0 ? (
            purchases.map((purchase, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedPurchaseIds.includes(purchase.purchaseId)}
                    onChange={(e) => handleSelectPurchase(e, purchase)}
                  />
                </TableCell>
                <TableCell>{purchase.supplier?.name || "-"}</TableCell>
                <TableCell>{purchase.product?.name || "-"}</TableCell>
                <TableCell>{new Date(purchase.date_time).toLocaleDateString()}</TableCell>
                <TableCell>
                  {purchase.purchaseStatus === PurchaseStatus.processing ? (
                    <Select
                      value={purchase.purchaseStatus}
                      onChange={(e) =>
                        handleStatusChange(purchase.purchaseId, e.target.value as PurchaseStatus)
                      }
                    >
                      {Object.entries(purchaseStatusMapping).map(([value, label]) => (
                        <MuiMenuItem key={value} value={value}>
                          {label}
                        </MuiMenuItem>
                      ))}
                    </Select>
                  ) : (
                    purchaseStatusMapping[purchase.purchaseStatus]
                  )}
                </TableCell>
                <TableCell>{`R$${purchase.price}`}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, purchase.purchaseId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === purchase.purchaseId)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => handleDetailsClick(purchase.purchaseId)}>Detalhes</MenuItem>
                    <MenuItem onClick={() => handleEditClick(purchase.purchaseId)}>Editar</MenuItem>
                    {purchase.paymentSlip !== null && (
                      <MenuItem onClick={() => handleViewDocumentClick(purchase.paymentSlip)}>
                        Visualizar Documento
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleDeleteClick(purchase.purchaseId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>Nenhum dado disponível</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que deseja deletar a compra?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleCloseMenu();
        }}
        onConfirm={() => selectedItem && handleDeletePurchase(selectedItem)}
        title="Deletar Compra"
      />
    </>
  );
};

export default PurchaseTableComponent;
