import type  { Customer } from "src/models/customers";

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

import { useDeleteCustomer } from "src/hooks/useCustomer";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface TableComponentProps {
  customers: Customer[];
  isLoading: boolean;
  isSearching: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ customers, isLoading, isSearching }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // Armazena o customerId
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useRouter();
  const deleteCustomer = useDeleteCustomer();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, customerId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(customerId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (customerId: number) => {
    navigate.push(`details/${customerId}`);
    handleClose();
  };

  const handleEditClick = (customerId: number) => {
    navigate.push(`edit/${customerId}`);
    handleClose();
  };

  const handleDeleteCustomer = (customerId: number) => {
    handleClose();
    deleteCustomer.mutate(customerId, {
      onSuccess: () => {
        notification.addNotification('Cliente deletado com sucesso', 'success');
        setDeleteModalOpen(false); 
      },
      onError: () => {
        notification.addNotification('Erro ao deletar cliente, tente novamente mais tarde', 'error');
      },
    });
  };

  const handleDeleteClick = (customerId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(customerId);
  };

  return (
    <>
      <Table stickyHeader aria-label="customers table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox />
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
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer.customerId}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  {customer.name || "-"}
                </TableCell>
                <TableCell>
                  {customer.contact || "-"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, customer.customerId)}>
                    ︙
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === customer.customerId)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                  >
                    <MenuItem onClick={() => handleDetailsClick(customer.customerId)}>
                      Detalhes
                    </MenuItem>
                    <MenuItem onClick={() => handleEditClick(customer.customerId)}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(customer.customerId)}>
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar o cliente?"
        onClose={() => { setDeleteModalOpen(false); handleClose(); }}
        onConfirm={() => selectedItem && handleDeleteCustomer(selectedItem)}
        title="Deletar Cliente"
      />
    </>
  );
};

export default TableComponent;
