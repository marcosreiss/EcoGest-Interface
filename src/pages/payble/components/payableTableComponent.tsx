import type { Payble } from "src/models/payable";

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
  isSearching?: boolean; // Adicionado para alinhamento com ReciveTableComponent
  setSelectedPaybles: React.Dispatch<React.SetStateAction<Payble[]>>;
}

const PaybleTableComponent: React.FC<PaybleTableComponentProps> = ({
  paybles,
  isLoading,
  isSearching = false,
  setSelectedPaybles,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const [selectedPaybleIds, setSelectedPaybleIds] = useState<number[]>([]);

  const router = useRouter();
  const deletePayble = useDeletePayble();
  const updatePaybleStatus = useUpdatePaybleStatus();
  const notification = useNotification();

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    paybleId: number
  ) => {
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

  // Função para confirmar a alteração de status
  const handleConfirmStatusChange = () => {
    if (selectedItem !== null) {
      updatePaybleStatus.mutate(
        { id: selectedItem, paybleStatus: "approved" },
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

  const handleDeleteClick = (paybleId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(paybleId);
    handleClose();
  };

  const handleDeletePayble = () => {
    if (selectedItem !== null) {
      deletePayble.mutate(selectedItem, {
        onSuccess: () => {
          notification.addNotification("Pagável deletado com sucesso", "success");
          setDeleteModalOpen(false);
          // Opcional: atualizar a lista de paybles após a deleção
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
      setSelectedPaybleIds((prev) => [...prev, payble.payableId]);
      setSelectedPaybles((prev) => [...prev, payble]);
    } else {
      setSelectedPaybleIds((prev) =>
        prev.filter((id) => id !== payble.payableId)
      );
      setSelectedPaybles((prev) =>
        prev.filter((p) => p.payableId !== payble.payableId)
      );
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
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={
                  paybles.length > 0 &&
                  selectedPaybleIds.length === paybles.length
                }
                indeterminate={
                  selectedPaybleIds.length > 0 &&
                  selectedPaybleIds.length < paybles.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell >ID</TableCell>
            <TableCell >Status</TableCell>
            <TableCell >Data de Emissão</TableCell>
            <TableCell >Data do Vencimento</TableCell>
            <TableCell >Descrição</TableCell>
            <TableCell >Valor Total</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading || isSearching ? (
            <TableRow>
              <TableCell colSpan={7} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : paybles.length > 0 ? (
            paybles.map((payble) => (
              <TableRow key={payble.payableId}>
                <TableCell>
                  <Checkbox
                    checked={selectedPaybleIds.includes(payble.payableId)}
                    onChange={(e) => handleSelectPayble(e, payble)}
                  />
                </TableCell>
                <TableCell>{payble.payableId}</TableCell>
                <TableCell>{payble.status || "-"}</TableCell>
                <TableCell>{formatDate(payble.dataEmissao)}</TableCell>
                <TableCell>{formatDate(payble.dataVencimento)}</TableCell>
                <TableCell>{payble.entry?.description || payble.purchase?.description || "-"}</TableCell>
                <TableCell>{formatPrice(payble.totalValue)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleClick(event, payble.payableId)}
                  >
                    ︙
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(
                      anchorEl && selectedItem === payble.payableId
                    )}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleDetailsClick(payble.payableId)}>Detalhes</MenuItem>
                    {payble.status !== "Pago" && (
                      <MenuItem onClick={() => setStatusModalOpen(true)}>Dar Baixa</MenuItem>
                    )}
                    <MenuItem onClick={() => handleDeleteClick(payble.payableId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
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
