import type { Receive } from "src/models/receive";

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

import { useDeleteRecive, useUpdateReceiveStatus } from "src/hooks/useReceive";

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
  const [statusModalOpen, setStatusModalOpen] = useState(false);


  const [selectedReciveIds, setSelectedReciveIds] = useState<number[]>([]);

  const navigate = useRouter();
  const deleteRecive = useDeleteRecive();
  const notification = useNotification();
  const updateReceiveStatus = useUpdateReceiveStatus();

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

  // Função para confirmar a alteração de status
  const handleConfirmStatusChange = () => {
    if (selectedItem !== null) {
      updateReceiveStatus.mutate(
        { id: selectedItem },
        {
          onSuccess: () => {
            notification.addNotification("Baixa realizada com sucesso!", "success");
            setStatusModalOpen(false);
            // Opcional: atualizar a lista de paybles após a alteração
          },
          onError: () => {
            notification.addNotification("Erro ao realizar a baixa", "error");
          },
        }
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
            <TableCell >ID</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Data de Emissão</TableCell>
            <TableCell >Data do Vencimento</TableCell>
            <TableCell >Valor Total</TableCell>
            <TableCell>Ações</TableCell>
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
                <TableCell>{recive.receiveId || "-"}</TableCell>
                <TableCell>{recive.status || "-"}</TableCell>
                <TableCell>{formatDate(recive.dataEmissao) || "-"}</TableCell>
                <TableCell>{formatDate(recive.dataVencimento) || "-"}</TableCell>
                <TableCell>{formatPrice(recive.totalValue) || "-"}</TableCell>
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
                    {recive.status !== "Pago" && (
                      <MenuItem onClick={() => setStatusModalOpen(true)}>Dar Baixa</MenuItem>
                    )}
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
                  <p>Nenhuma conta a pagar registrada</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal de Confirmação para Dar Baixa */}
      <ConfirmationDialog
        open={statusModalOpen}
        confirmButtonText="Confirmar"
        description="Tem certeza que deseja dar baixa neste pagável?"
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        title="Dar Baixa"
      />

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
