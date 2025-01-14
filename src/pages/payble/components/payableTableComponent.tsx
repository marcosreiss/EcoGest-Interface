import type { Payble } from "src/models/payble";

import React, { useState } from "react";

import {
  Menu,
  Table,
  Dialog,
  Button,
  Select,
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

import {
  useDeletePayble,
  useUpdatePaybleStatus,
} from "src/hooks/usePayble";

import { useNotification } from "src/context/NotificationContext";

interface PaybleTableComponentProps {
  paybles: Payble[];
  isLoading: boolean;
  setSelectedPaybles: React.Dispatch<React.SetStateAction<Payble[]>>;
}

const PaybleTableComponent: React.FC<PaybleTableComponentProps> = ({
  paybles,
  isLoading,
  setSelectedPaybles,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"approved" | "canceled">("approved");
  const [selectedPaybleIds, setSelectedPaybleIds] = useState<number[]>([]);

  const router = useRouter();
  const deletePayble = useDeletePayble();
  const updatePaybleStatus = useUpdatePaybleStatus();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, paybleId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(paybleId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (paybleId: number) => {
    router.push(`/paybles/details/${paybleId}`);
    handleClose();
  };

  const handleOpenStatusModal = () => {
    setStatusModalOpen(true);
    setAnchorEl(null);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmStatusChange = () => {
    if (selectedItem !== null) {
      updatePaybleStatus.mutate(
        { id: selectedItem, paybleStatus: newStatus },
        {
          onSuccess: () => {
            notification.addNotification("Status atualizado com sucesso!", "success");
            setStatusModalOpen(false);
          },
          onError: () => {
            notification.addNotification("Erro ao atualizar status", "error");
          },
        }
      );
    }
  };

  const handleDeleteClick = (paybleId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(paybleId);
  };

  const handleDeletePayble = (paybleId: number) => {
    handleClose();
    deletePayble.mutate(paybleId, {
      onSuccess: () => {
        notification.addNotification("Pagável deletado com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification("Erro ao deletar pagável", "error");
      },
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = paybles.map((p) => p.paybleId);
      setSelectedPaybleIds(allIds);
      setSelectedPaybles(paybles);
    } else {
      setSelectedPaybleIds([]);
      setSelectedPaybles([]);
    }
  };

  const handleSelectPayble = (
    event: React.ChangeEvent<HTMLInputElement>,
    payble: Payble
  ) => {
    if (event.target.checked) {
      setSelectedPaybleIds((prev) => [...prev, payble.paybleId]);
      setSelectedPaybles((prev) => [...prev, payble]);
    } else {
      setSelectedPaybleIds((prev) => prev.filter((id) => id !== payble.paybleId));
      setSelectedPaybles((prev) => prev.filter((p) => p.paybleId !== payble.paybleId));
    }
  };

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString("pt-BR") : "-");

  return (
    <>
      <Table stickyHeader aria-label="paybles table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={paybles.length > 0 && selectedPaybleIds.length === paybles.length}
                indeterminate={
                  selectedPaybleIds.length > 0 && selectedPaybleIds.length < paybles.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data de Emissão</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Valor Total</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          ) : paybles.length > 0 ? (
            paybles.map((payble) => (
              <TableRow key={payble.paybleId}>
                <TableCell>
                  <Checkbox
                    checked={selectedPaybleIds.includes(payble.paybleId)}
                    onChange={(e) => handleSelectPayble(e, payble)}
                  />
                </TableCell>
                <TableCell>{payble.paybleId}</TableCell>
                <TableCell>{payble.status}</TableCell>
                <TableCell>{formatDate(payble.dataEmissao)}</TableCell>
                <TableCell>{payble.entry?.description || payble.purchase?.description || "-"}</TableCell>
                <TableCell>{payble.totalValue.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleClick(e, payble.paybleId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === payble.paybleId)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleDetailsClick(payble.paybleId)}>Detalhes</MenuItem>
                    <MenuItem onClick={() => handleOpenStatusModal()}>Atualizar Status</MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(payble.paybleId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg" // Ajustado para usar forward slashes
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhuma Payable Cadastrada</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={statusModalOpen} onClose={handleCloseStatusModal}>
        <DialogTitle>Atualizar Status</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as "approved" | "canceled")}
          >
            <MenuItem value="approved">Aprovado</MenuItem>
            <MenuItem value="canceled">Cancelado</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal}>Cancelar</Button>
          <Button onClick={handleConfirmStatusChange} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>Deletar Pagável</DialogTitle>
        <DialogContent>Tem certeza que deseja deletar este pagável?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => selectedItem && handleDeletePayble(selectedItem)}
            variant="contained"
            color="error"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaybleTableComponent;
