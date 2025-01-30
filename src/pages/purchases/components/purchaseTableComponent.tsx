import React, { useState } from "react";

import {
  Menu,
  Table,
  Checkbox,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useDeletePurchase } from "src/hooks/usePurchase";

import { type Purchase,  } from "src/models/purchase";
import { useNotification } from "src/context/NotificationContext";

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
  const notification = useNotification();

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

  const handleViewDocumentClick = async (paymentSlip: { data: number[] } | null) => {
    if (!paymentSlip) {
      notification.addNotification("Nenhum documento disponível.", "error");
      return;
    }
  
    const blob = new Blob([new Uint8Array(paymentSlip.data)]);
    const fileReader = new FileReader();
  
    fileReader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const uintArray = new Uint8Array(arrayBuffer);
  
      // Extrai os primeiros bytes para verificação do tipo
      const header = uintArray.slice(0, 4);
  
      // Converte os primeiros bytes para uma string legível
      const headerHex = Array.from(header).map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
  
      if (headerHex.startsWith("25 50 44 46")) {
        // PDF (%PDF)
        const pdfBlob = new Blob([uintArray], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
      } else if (headerHex.startsWith("ff d8 ff")) {
        // JPEG (FFD8FF)
        const jpegBlob = new Blob([uintArray], { type: "image/jpeg" });
        const jpegUrl = URL.createObjectURL(jpegBlob);
        window.open(jpegUrl, "_blank");
      } else if (headerHex.startsWith("89 50 4e 47")) {
        // PNG (\x89PNG)
        const pngBlob = new Blob([uintArray], { type: "image/png" });
        const pngUrl = URL.createObjectURL(pngBlob);
        window.open(pngUrl, "_blank");
      } else {
        notification.addNotification("Formato de arquivo não suportado.", "error");
      }
    };
  
    fileReader.onerror = () => {
      notification.addNotification("Erro ao ler o arquivo.", "error");
    };
  
    fileReader.readAsArrayBuffer(blob);
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

  return (
    <>
      <Table stickyHeader aria-label="purchases table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "8%" }}>
              <Checkbox
                checked={purchases.length > 0 && selectedPurchaseIds.length === purchases.length}
                indeterminate={selectedPurchaseIds.length > 0 && selectedPurchaseIds.length < purchases.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Cód</TableCell>
            <TableCell>Fornecedor</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Valor</TableCell>
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
            purchases.map((purchase) => (
              <TableRow key={purchase.purchaseId}>

                <TableCell>
                  <Checkbox
                    checked={selectedPurchaseIds.includes(purchase.purchaseId)}
                    onChange={(e) => handleSelectPurchase(e, purchase)}
                  />
                </TableCell>

                <TableCell>{purchase.purchaseId || "-"}</TableCell>

                <TableCell>{purchase.supplier?.name || "-"}</TableCell>

                <TableCell>{purchase.description || "-"}</TableCell>

                {/* Data formatada */}
                <TableCell>
                  {purchase.date_time
                    ? formatDate(purchase.date_time)
                    : "-"}
                </TableCell>

                <TableCell>{formatPrice(purchase.totalPrice)}</TableCell>

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
              {/* Ajuste colSpan para 7 colunas */}
              <TableCell colSpan={7} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg" // Ajustado para usar forward slashes
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhuma Compra Cadastrada</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog de Confirmação para Deletar */}
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
