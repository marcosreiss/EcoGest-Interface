import type { Dispatch, SetStateAction } from 'react';
import type { FilterParams } from 'src/models/filterParams';

import React, { useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';

interface TableSearchProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void | null;
  selectedRows: any[];
  isSearchDisabled: boolean;
  handleDelete: () => void;
  setSearchByPeriod: Dispatch<SetStateAction<FilterParams>>;
}

const SalesTableSearch: React.FC<TableSearchProps> = ({
  handleSearchChange,
  selectedRows,
  isSearchDisabled,
  handleDelete,
  setSearchByPeriod,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpen = () => setDeleteModalOpen(true);
  const handleClose = () => setDeleteModalOpen(false);

  const handleDeleteRows = () => {
    handleClose();
    handleDelete();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e0e0e0',
          borderRadius: '8px 8px 0 0',
          minHeight: '70px',
        }}
      >
        {/* Campo para Data Inicial */}
        <Box sx={{ flex: 1, marginRight: '16px' }}>
          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setSearchByPeriod((prevState) => ({
                ...prevState,
                startDate: e.target.value,
              }))
            }
          />
        </Box>

        {/* Campo para Data Final */}
        <Box sx={{ flex: 1, marginRight: '16px' }}>
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setSearchByPeriod((prevState) => ({
                ...prevState,
                endDate: e.target.value,
              }))
            }
          />
        </Box>

        {/* Botão de Deletar */}
        {selectedRows.length > 0 ? (
          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              marginLeft: '16px',
              padding: '6px 16px',
              borderRadius: '8px',
            }}
            onClick={handleOpen}
          >
            Deletar Selecionados ({selectedRows.length})
          </Button>
        ) : (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ marginLeft: '16px' }}
          > </Typography>
        )}
      </Box>

      {/* Modal de Confirmação para Deletar */}
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar as vendas selecionadas?"
        onClose={handleClose}
        onConfirm={handleDeleteRows}
        title="Deletar Vendas"
      />
    </>
  );
};

export default SalesTableSearch;
