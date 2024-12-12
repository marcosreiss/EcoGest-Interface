import type { Product } from 'src/models/product';

import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteProduct, useGetProductsPaginated } from 'src/hooks/useProduct';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import TableSearch from 'src/layouts/components/tableSearch';
import { useNotification } from 'src/context/NotificationContext';
import TableFooterComponent from 'src/layouts/components/tableFooterComponent';
import TableHeaderComponent from 'src/layouts/components/tableHeaderComponent';

import ProductTableComponent from './components/productTableComponent';


// ----------------------------------------------------------------------

export default function ProductPage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetProductsPaginated(page * rowsPerPage, rowsPerPage);

  const totalItemsRef = React.useRef(0);

  // Define totalItems apenas na primeira chamada
  if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
    totalItemsRef.current = data.meta.totalItems;
  }
  const totalItems = totalItemsRef.current; // Use totalItemsRef.current onde necessário

  const products = data?.data || [];

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


  return (
    <>
      <Helmet>
        <title>{`Produtos - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <TableHeaderComponent
            title='Produtos'
            addButtonName='Cadastrar Produto'
            addButtonPath='/products/create'
          />
          <Grid item xs={12}>
            <TableSearch handleDelete={handleDeleteProduct} handleSearchChange={() => null} isSearchDisabled selectedRows={selectedProducts} />
            <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <ProductTableComponent
                  setSelectedProducts={setSelectedProducts}
                  products={products}
                  isLoading={isLoading}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
