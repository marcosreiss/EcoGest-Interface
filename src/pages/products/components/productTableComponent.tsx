import type { Product } from "src/models/product";

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

import * as useProduct from "src/hooks/useProduct"; // Ajustar o caminho caso necessário
import { useRouter } from "src/routes/hooks";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface ProductTableComponentProps {
  products: Product[];
  isLoading: boolean;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductTableComponent: React.FC<ProductTableComponentProps> = ({
  products,
  isLoading,
  setSelectedProducts,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useRouter();
  const deleteProduct = useProduct.useDeleteProduct();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, productId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(productId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (productId: number) => {
    navigate.push(`details/${productId}`);
    handleCloseMenu();
  };

  const handleEditClick = (productId: number) => {
    navigate.push(`edit/${productId}`);
    handleCloseMenu();
  };

  const handleDeleteClick = (productId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(productId);
  };

  const handleDeleteProduct = (productId: number) => {
    handleCloseMenu();
    deleteProduct.mutate(productId, {
      onSuccess: () => {
        notification.addNotification("Produto deletado com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification("Erro ao deletar produto, tente novamente mais tarde", "error");
      },
    });
  };

  // Função para formatar o peso em PT-BR
  const formatWeight = (weightKg: number | undefined): string => {
    if (weightKg === undefined) return "-";

    return `${weightKg.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} Ton`;
  };

  // Função para formatar o preço em PT-BR
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "-";

    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Seleciona ou deseleciona todos os produtos ao marcar o checkbox do header
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = products.map((p) => p.productId);
      setSelectedProductIds(allIds);
      setSelectedProducts(products);
    } else {
      setSelectedProductIds([]);
      setSelectedProducts([]);
    }
  };

  // Seleciona ou deseleciona um produto específico
  const handleSelectProduct = (event: React.ChangeEvent<HTMLInputElement>, product: Product) => {
    if (event.target.checked) {
      setSelectedProductIds((prev) => [...prev, product.productId]);
      setSelectedProducts((prev) => [...prev, product]);
    } else {
      setSelectedProductIds((prev) => prev.filter((id) => id !== product.productId));
      setSelectedProducts((prev) => prev.filter((p) => p.productId !== product.productId));
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="products table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={products.length > 0 && selectedProductIds.length === products.length}
                indeterminate={
                  selectedProductIds.length > 0 && selectedProductIds.length < products.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ width: "40%", minWidth: "150px" }}>Nome</TableCell>
            <TableCell sx={{ width: "30%", minWidth: "100px" }}>Quantidade</TableCell>
            <TableCell sx={{ width: "20%", minWidth: "100px" }}>Preço</TableCell>
            <TableCell sx={{ width: "5%" }}> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>
                  <Checkbox
                    checked={selectedProductIds.includes(product.productId)}
                    onChange={(e) => handleSelectProduct(e, product)}
                  />
                </TableCell>
                <TableCell>{product.name || "-"}</TableCell>
                <TableCell>{formatWeight(Number(product.weightAmount))}</TableCell>
                <TableCell>{formatPrice(Number(product.price))}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, product.productId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === product.productId)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleDetailsClick(product.productId)}>Detalhes</MenuItem>
                    <MenuItem onClick={() => handleEditClick(product.productId)}>Editar</MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(product.productId)}>Deletar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar o produto?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleCloseMenu();
        }}
        onConfirm={() => selectedItem && handleDeleteProduct(selectedItem)}
        title="Deletar Produto"
      />
    </>
  );
};

export default ProductTableComponent;
