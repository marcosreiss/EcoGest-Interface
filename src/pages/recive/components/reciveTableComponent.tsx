import type { Receive } from "src/models/recive";

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

import { useDeleteRecive } from "src/hooks/useRecive";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface TableComponentProps {
  recives: Receive[];
  isLoading: boolean;
  isSearching: boolean;
  setSelectedRecives: React.Dispatch<React.SetStateAction<Receive[]>>;
}

const ReciveTableComponent: React.FC<TableComponentProps> = ({
  recives,
  isLoading,
  isSearching,
  setSelectedRecives,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedReciveIds, setSelectedReciveIds] = useState<number[]>([]);

  const navigate = useRouter();
  const deleteRecive = useDeleteRecive();
  const notification = useNotification();

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    reciveId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(reciveId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (reciveId: number) => {
    navigate.push(`details/${reciveId}`);
    handleClose();
  };

  const handleEditClick = (reciveId: number) => {
    navigate.push(`edit/${reciveId}`);
    handleClose();
  };

  const handleDeleteRecive = (reciveId: number) => {
    handleClose();
    deleteRecive.mutate(reciveId, {
      onSuccess: () => {
        notification.addNotification("Recebível deletado com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification(
          "Erro ao deletar recebível, tente novamente mais tarde",
          "error"
        );
      },
    });
  };

  const handleDeleteClick = (reciveId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(reciveId);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = recives.map((r) => r.receiveId);
      setSelectedReciveIds(allIds);
      setSelectedRecives(recives);
    } else {
      setSelectedReciveIds([]);
      setSelectedRecives([]);
    }
  };

  const handleSelectRecive = (
    event: React.ChangeEvent<HTMLInputElement>,
    recive: Receive
  ) => {
    if (event.target.checked) {
      setSelectedReciveIds((prev) => [...prev, recive.receiveId]);
      setSelectedRecives((prev) => [...prev, recive]);
    } else {
      setSelectedReciveIds((prev) =>
        prev.filter((id) => id !== recive.receiveId)
      );
      setSelectedRecives((prev) =>
        prev.filter((r) => r.receiveId !== recive.receiveId)
      );
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="recives table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={
                  recives.length > 0 &&
                  selectedReciveIds.length === recives.length
                }
                indeterminate={
                  selectedReciveIds.length > 0 &&
                  selectedReciveIds.length < recives.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ width: "25%", minWidth: "150px" }}>Status</TableCell>
            <TableCell sx={{ width: "25%", minWidth: "150px" }}>Data de Vencimento</TableCell>
            <TableCell sx={{ width: "25%", minWidth: "150px" }}>Valor Total</TableCell>
            <TableCell sx={{ width: "5%" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading || isSearching ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : recives.length > 0 ? (
            recives.map((recive) => (
              <TableRow key={recive.receiveId}>
                <TableCell>
                  <Checkbox
                    checked={selectedReciveIds.includes(recive.receiveId)}
                    onChange={(e) => handleSelectRecive(e, recive)}
                  />
                </TableCell>
                <TableCell>{recive.status || "-"}</TableCell>
                <TableCell>{recive.dataVencimento || "-"}</TableCell>
                <TableCell>{recive.totalValue.toFixed(2) || "-"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleClick(event, recive.receiveId)}
                  >
                    ︙
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(
                      anchorEl && selectedItem === recive.receiveId
                    )}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => handleDetailsClick(recive.receiveId)}
                    >
                      Detalhes
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleEditClick(recive.receiveId)}
                    >
                      Editar
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteClick(recive.receiveId)}
                    >
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg"
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhum Recebível Cadastrado</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar este recebível?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleClose();
        }}
        onConfirm={() => selectedItem && handleDeleteRecive(selectedItem)}
        title="Deletar Recebível"
      />
    </>
  );
};

export default ReciveTableComponent;
