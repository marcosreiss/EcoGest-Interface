import type { Payble } from "src/models/payable";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Menu,
  Table,
  Button,
  Dialog,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  TextField,
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
  useUpdateDataPagamentoPayable,
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
  const [editPaymentModalOpen, setEditPaymentModalOpen] = useState(false);

  const [selectedPaybleIds, setSelectedPaybleIds] = useState<number[]>([]);

  const router = useRouter();
  const deletePayble = useDeletePayble();
  const updatePaybleStatus = useUpdatePaybleStatus();
  const updateDataPagamentoPayable = useUpdateDataPagamentoPayable();
  const notification = useNotification();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<{ dataPagamento: string }>({
    defaultValues: {
      dataPagamento: "",
    },
  });

  // Função para determinar a cor com base no status
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Pago":
        return "#4287f5";
      case "Atrasado":
        return "#f72d2d";
      case "Aberto":
        return "#2fba54";
      default:
        return "gray"; // Caso o status seja indefinido ou desconhecido
    }
  };

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

  const handleEditDataPagamentoClick = (payable: Payble) => {
    setValue("dataPagamento", payable.dataPagamento?.split("T")[0] || "");
    setSelectedItem(payable.payableId);
    setEditPaymentModalOpen(true);
  };

  const onSubmitEditPayment = (data: { dataPagamento: string }) => {
    if (selectedItem !== null) {
      updateDataPagamentoPayable.mutate(
        { dataPagamento: data.dataPagamento, payableId: selectedItem },
        {
          onSuccess: () => {
            notification.addNotification("Data de pagamento atualizada com sucesso!", "success");
            setEditPaymentModalOpen(false);
            // Opcional: atualizar a lista de paybles após a alteração
            reset();
          },
          onError: () => {
            notification.addNotification("Erro ao atualizar a data de pagamento", "error");
          },
        }
      );
    }
  };

  // Função para formatar a data no formato pt-BR
  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    const dateObj = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    dateObj.setDate(dateObj.getDate() + 1);
    return dateObj.toLocaleDateString("pt-BR");
  };

  const formatPrice = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
            <TableCell>Cód</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Fornecedor</TableCell>
            <TableCell>NF-e</TableCell>
            <TableCell>Data de Emissão</TableCell>
            <TableCell>Data do Vencimento</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Valor Total</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading || isSearching ? (
            <TableRow>
              <TableCell colSpan={10} sx={{ padding: 0 }}>
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
                <TableCell>
                  {/* Shape colorido atrás do texto */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      px: 2, // Padding horizontal para espaçamento do texto
                      py: 0.5, // Padding vertical para altura do "botão"
                      borderRadius: 8, // Arredondamento do "botão"
                      color: "white", // Cor do texto
                      fontWeight: "bold",
                      textAlign: "center",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      backgroundColor: getStatusColor(payble.status), // Cor de fundo baseada no status
                    }}
                  >
                    {payble.status || "-"}
                  </Box>
                </TableCell>
                <TableCell>{payble.purchase?.supplier?.name || "-"}</TableCell>
                <TableCell>{payble.purchase?.nfe || "-"}</TableCell>
                <TableCell>{formatDate(payble.dataEmissao)}</TableCell>
                <TableCell>{formatDate(payble.dataVencimento)}</TableCell>
                <TableCell>
                  {payble.entry?.description || payble.purchase?.description || "-"}
                </TableCell>
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
                    <MenuItem onClick={() => handleEditDataPagamentoClick(payble)}>Editar Data do Pagamento</MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(payble.payableId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} align="center">
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

      {/* Modal para editar a data de pagamento */}
      <Dialog
        open={editPaymentModalOpen}
        onClose={() => {
          setEditPaymentModalOpen(false);
          reset();
        }}
      >
        <DialogTitle>Editar Data do Pagamento</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitEditPayment)}>
          <DialogContent>
            <Controller
              name="dataPagamento"
              control={control}
              rules={{ required: "Data de pagamento é obrigatória." }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Data de Pagamento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  error={!!errors.dataPagamento}
                  helperText={errors.dataPagamento?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setEditPaymentModalOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Atualizar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modais de confirmação permanecem os mesmos */}
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
        description="Tem certeza que deseja deletar este pagável?"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePayble}
        title="Deletar Pagável"
      />
    </>
  );
};

export default PaybleTableComponent;
