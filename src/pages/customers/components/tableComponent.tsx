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

interface TableComponentProps<T> {
  tableName: string;
  data: T[];
  isLoading: boolean;
  fieldLabels: Record<string, string>;
}

const TableComponent = <T extends { id: number }>({
  tableName,
  data,
  isLoading,
  fieldLabels,
}: TableComponentProps<T>) => {
  const fields = data.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : [];
  const columnsCount = fields.length - 1;
  const columnsWidth = 95 / columnsCount;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // Agora armazena um id
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useRouter();
  const deleteCustomer = useDeleteCustomer();
  const notification = useNotification();

  const handleClick = (event: any, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item.id); // Salva o id do item
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (id: number) => {
    navigate.push(`details/${id}`);
    handleClose();
  };
  const handleEditClick = (id: number) => {
    navigate.push(`edit/${id}`);
    handleClose();
  };

  const handleDeleteCustomer = (id: number) => {
    handleClose();
    deleteCustomer.mutate(id, {
      onSuccess: () => {
        notification.addNotification('Cliente deletado com sucesso', 'success');
        setDeleteModalOpen(false); // Fecha o modal após sucesso
      },
      onError: () => {
        notification.addNotification('Erro ao deletar cliente, tente novamente mais tarde', 'error');
      }
    });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteModalOpen(true); // Abre o modal de confirmação
    setSelectedItem(id); // Armazena o id do cliente a ser deletado
  };

  return (
    <Table stickyHeader aria-label={`${tableName} table`}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: "5%", minWidth: "50px" }}>
            <Checkbox />
          </TableCell>
          {fields.map((field) => (
            field !== 'id' && (
              <TableCell
                key={String(field)}
                sx={{
                  width: `${columnsWidth}%`,
                  minWidth: "150px",
                }}
              >
                {fieldLabels[String(field)] || String(field)}
              </TableCell>
            )
          ))}
          <TableCell> </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columnsCount + 1} sx={{ padding: 0 }}>
              <LinearProgress sx={{ width: "100%" }} />
            </TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox />
              </TableCell>
              {fields.map((field) => (
                field !== 'id' && (
                  <TableCell key={String(field)}>
                    {String(row[field]) || "-"}
                  </TableCell>
                )))}
              <TableCell>
                <IconButton onClick={(event) => handleClick(event, row)}>
                  ︙
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl && selectedItem === row.id)}
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
                  <MenuItem onClick={() => handleDetailsClick(row.id)}>
                    Detalhes
                  </MenuItem>
                  <MenuItem onClick={() => handleEditClick(row.id)}>
                  Editar
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteClick(row.id)}>
                    Deletar
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsCount + 1}>No data available</TableCell>
          </TableRow>
        )}
      </TableBody>

      {/* Modal de confirmação */}
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar o cliente?"
        onClose={() => { setDeleteModalOpen(false); handleClose(); }}
        onConfirm={() => selectedItem && handleDeleteCustomer(selectedItem)} // Chama a função de deleção com o id
        title="Deletar Cliente"
      />
    </Table>
  );
};

export default TableComponent;
