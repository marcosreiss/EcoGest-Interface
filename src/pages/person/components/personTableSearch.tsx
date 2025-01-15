// src/pages/components/personTableSearch.tsx

import type { SelectChangeEvent } from '@mui/material';

import React, { useState } from 'react';

import { Box, Grid, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from '@mui/material';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';

interface PersonTableSearchProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void | null;
  selectedRows: any[];
  isSearchDisabled: boolean;
  handleDelete: () => void;
  handleFilterChange: (newFilter: 'all' | 'customer' | 'supplier') => void;
  currentFilter: 'all' | 'customer' | 'supplier';
}

const PersonTableSearch: React.FC<PersonTableSearchProps> = ({
  handleSearchChange,
  selectedRows,
  isSearchDisabled,
  handleDelete,
  handleFilterChange,
  currentFilter,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const handleOpen = () => setDeleteModalOpen(true);
  const handleClose = () => setDeleteModalOpen(false);

  const handleDeleteRows = () => {
    handleClose();
    handleDelete();
  };  

  // Correção do tipo do evento para SelectChangeEvent
  const onFilterChange = (event: SelectChangeEvent<'all' | 'customer' | 'supplier'>) => {
    const newFilter = event.target.value as 'all' | 'customer' | 'supplier';
    handleFilterChange(newFilter);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e0e0e0',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Barra de Pesquisa */}
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              placeholder={isSearchDisabled ? "Desabilitado" : "Pesquisar..."}
              variant="outlined"
              size="small"
              onChange={handleSearchChange}
              disabled={isSearchDisabled}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                },
              }}
            />
          </Grid>

          {/* Seletor de Filtro */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-label">Tipo</InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={currentFilter}
                label="Tipo"
                onChange={onFilterChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="customer">Clientes</MenuItem>
                <MenuItem value="supplier">Fornecedores</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Botão de Deletar Selecionados */}
          <Grid item xs={12} sm={12} md={3}>
            {selectedRows.length > 0 ? (
              <Button
                variant="contained"
                color="error"
                sx={{
                  textTransform: 'none',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  width: '100%',
                }}
                onClick={handleOpen}
              >
                Deletar Selecionados ({selectedRows.length})
              </Button>
            ) : (
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                {/* Espaço reservado ou mensagem opcional */}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
      
      {/* Diálogo de Confirmação */}
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar as pessoas selecionadas?"
        onClose={handleClose}
        onConfirm={handleDeleteRows}
        title="Deletar Pessoas"
      />
    </>
  );
}

export default PersonTableSearch;
