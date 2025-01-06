import type { Supplier } from "src/models/supplier";

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

import { useDeleteSupplier } from "src/hooks/useSupplier";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface SupplierTableComponentProps {
  suppliers: Supplier[];
  isLoading: boolean;
  isSearching: boolean;
  setSelectedSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

const SupplierTableComponent: React.FC<SupplierTableComponentProps> = ({
  suppliers,
  isLoading,
  isSearching,
  setSelectedSuppliers,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedSupplierIds, setSelectedSupplierIds] = useState<number[]>([]);

  const navigate = useRouter();
  const deleteSupplier = useDeleteSupplier();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, supplierId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(supplierId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (supplierId: number) => {
    navigate.push(`/suppliers/details/${supplierId}`);
    handleCloseMenu();
  };

  const handleEditClick = (supplierId: number) => {
    navigate.push(`/suppliers/edit/${supplierId}`);
    handleCloseMenu();
  };

  const handleDeleteClick = (supplierId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(supplierId);
  };

  const handleDeleteSupplierFunc = (supplierId: number) => {
    handleCloseMenu();
    deleteSupplier.mutate(supplierId, {
      onSuccess: () => {
        notification.addNotification('Fornecedor deletado com sucesso', 'success');
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification('Erro ao deletar fornecedor, tente novamente mais tarde', 'error');
      },
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = suppliers.map((s) => s.supplierId);
      setSelectedSupplierIds(allIds);
      setSelectedSuppliers(suppliers);
    } else {
      setSelectedSupplierIds([]);
      setSelectedSuppliers([]);
    }
  };

  const handleSelectSupplier = (event: React.ChangeEvent<HTMLInputElement>, supplier: Supplier) => {
    if (event.target.checked) {
      setSelectedSupplierIds((prev) => [...prev, supplier.supplierId]);
      setSelectedSuppliers((prev) => [...prev, supplier]);
    } else {
      setSelectedSupplierIds((prev) => prev.filter((id) => id !== supplier.supplierId));
      setSelectedSuppliers((prev) => prev.filter((s) => s.supplierId !== supplier.supplierId));
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="suppliers table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={suppliers.length > 0 && selectedSupplierIds.length === suppliers.length}
                indeterminate={selectedSupplierIds.length > 0 && selectedSupplierIds.length < suppliers.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ width: "45%", minWidth: "150px" }}>Nome</TableCell>
            <TableCell sx={{ width: "45%", minWidth: "150px" }}>Contato</TableCell>
            <TableCell sx={{ width: "5%" }}> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading || isSearching ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <TableRow key={supplier.supplierId}>
                <TableCell>
                  <Checkbox
                    checked={selectedSupplierIds.includes(supplier.supplierId)}
                    onChange={(e) => handleSelectSupplier(e, supplier)}
                  />
                </TableCell>
                <TableCell>{supplier.name || "-"}</TableCell>
                <TableCell>{supplier.contact || "-"}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, supplier.supplierId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === supplier.supplierId)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                  >
                    <MenuItem onClick={() => handleDetailsClick(supplier.supplierId)}>
                      Detalhes
                    </MenuItem>
                    <MenuItem onClick={() => handleEditClick(supplier.supplierId)}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(supplier.supplierId)}>
                      Deletar
                    </MenuItem>
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
                  <p>Nenhum Fornecedor Cadastrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar o fornecedor?"
        onClose={() => { setDeleteModalOpen(false); handleCloseMenu(); }}
        onConfirm={() => selectedItem && handleDeleteSupplierFunc(selectedItem)}
        title="Deletar Fornecedor"
      />
    </>
  );
};

export default SupplierTableComponent;
