import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useGetProductsPaginated } from 'src/hooks/useProduct';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard'; // Ajuste o caminho do hook
import type { Product } from 'src/models/product';

import ProductTableComponent from './components/productTableComponent'; // Ajuste o caminho do componente
import TableFooterComponent from '../customers/components/tableFooterComponent';
import TableHeaderComponent from '../customers/components/tableHeaderComponent';


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
            <TableContainer component={Paper} sx={{height: '65vh', display: 'flex', flexDirection: 'column' }}>
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
