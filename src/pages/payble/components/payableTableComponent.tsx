import type { Payble } from "src/models/payble";

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

import {
  useDeletePayble,
  useUpdatePaybleStatus,
} from "src/hooks/usePayble";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

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
    router.push(`/payable/details/${paybleId}`);
    handleClose();
  };

  // Lidar com dar baixa no pagável
  const handleConfirmStatusChange = () => {
    if (selectedItem !== null) {
      updatePaybleStatus.mutate(
        { id: selectedItem, paybleStatus: "approved" },
        {
          onSuccess: () => {
            notification.addNotification("Baixa realizada com sucesso!", "success");
            setStatusModalOpen(false);
          },
          onError: () => {
            notification.addNotification("Erro ao realizar a baixa", "error");
          },
        }
      );
    }
  };

  const handleDeleteClick = (paybleId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(paybleId);
  };

  const handleDeletePayble = () => {
    if (selectedItem !== null) {
      deletePayble.mutate(selectedItem, {
        onSuccess: () => {
          notification.addNotification("Pagável deletado com sucesso", "success");
          setDeleteModalOpen(false);
        },
        onError: () => {
          notification.addNotification("Erro ao deletar pagável", "error");
        },
      });
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = paybles.map((p) => p.payableId);
      setSelectedPaybles(paybles);
    } else {
      setSelectedPaybles([]);
    }
  };

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString("pt-BR") : "-");

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "-";
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
      <Table stickyHeader aria-label="paybles table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={paybles.length > 0 && paybles.length === paybles.length}
                indeterminate={paybles.length > 0 && paybles.length < paybles.length}
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
              <TableRow key={payble.payableId}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{payble.payableId}</TableCell>
                <TableCell>{payble.status}</TableCell>
                <TableCell>{formatDate(payble.dataEmissao)}</TableCell>
                <TableCell>{payble.entry?.description || payble.purchase?.description || "-"}</TableCell>
                <TableCell>{formatPrice(payble.totalValue)}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleClick(e, payble.payableId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === payble.payableId)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleDetailsClick(payble.payableId)}>Detalhes</MenuItem>
                    <MenuItem onClick={() => setStatusModalOpen(true)}>Dar Baixa</MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(payble.payableId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Nenhum pagável cadastrado
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

      {/* Modal de Confirmação para Deletar */}
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que deseja deletar este pagável?"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePayble}
        title="Deletar Pagável"
      />
    </>
  );
};

export default PaybleTableComponent;
