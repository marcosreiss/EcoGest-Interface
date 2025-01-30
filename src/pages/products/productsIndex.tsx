import type { Product } from 'src/models/product';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteProduct, useGetProductsPaged, useGetProductByName } from 'src/hooks/useProduct';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import TableSearch from 'src/components/table/tableSearch';
import { useNotification } from 'src/context/NotificationContext';
import TableFooterComponent from 'src/components/table/tableFooterComponent';
import TableHeaderComponent from 'src/components/table/tableHeaderComponent';

import ProductTableComponent from './components/productTableComponent';

// ----------------------------------------------------------------------

export default function ProductPage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const rowsPerPage = 25;
  const [page, setPage] = useState(0);

  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useGetProductsPaged(page * rowsPerPage, rowsPerPage);

  const { data: searchResults, isLoading: isSearching } = useGetProductByName(debouncedSearchString);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Limpa o timeout anterior para reiniciar o debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Se o valor tiver 3 ou mais caracteres, inicia o debounce
    if (inputValue.length >= 3) {
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchString(inputValue); // Atualiza o valor com debounce
      }, 500); // Atraso de 500ms antes de executar a busca
    } else {
      // Se o valor for menor que 3 caracteres, limpa a busca
      setDebouncedSearchString('');
    }
  };

  const deleteProduct = useDeleteProduct();
  const notification = useNotification();

  const handleDeleteProduct = () => {
    selectedProducts.forEach((product) => {
      deleteProduct.mutate(product.productId, {
        onSuccess: () => {
          notification.addNotification('Produto deletado com sucesso', 'success');
          setSelectedProducts([]); // Limpa a seleção após a exclusão
        },
        onError: () => {
          notification.addNotification('Erro ao deletar produto, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  const products = debouncedSearchString.length >= 3 ? searchResults?.data : data?.data;
  
  return (
    <>
      <Helmet>
        <title>{`Produtos - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <TableHeaderComponent
            title='Produtos'
            addButtonName='Cadastrar Produto'
            addButtonPath='/products/create'
          />
          <Grid item xs={12}>
            <TableSearch
              handleDelete={handleDeleteProduct}
              handleSearchChange={handleSearchChange}
              isSearchDisabled={false}
              selectedRows={selectedProducts}
            />
            <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <ProductTableComponent
                  setSelectedProducts={setSelectedProducts}
                  products={products || []}
                  isLoading={isLoading || isSearching}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={data?.meta.totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
