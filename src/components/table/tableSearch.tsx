

import React, { useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';



interface TableSearchProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void | null;
  selectedRows: any[];
  isSearchDisabled: boolean;
  handleDelete: ()=>void;
}

const TableSearch: React.FC<TableSearchProps> = ({ handleSearchChange, selectedRows, isSearchDisabled, handleDelete }) => {
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
        }}
      >
        {/* Barra de Pesquisa */}
        <Box sx={{ flex: 1, marginRight: '16px' }}>
        <TextField
            fullWidth
            placeholder={isSearchDisabled ? "desabilitado" : "Pesquisar..."}
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
            Delatar Selecionados ({selectedRows.length})
          </Button>
        ) : (
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ marginLeft: '16px' }}
          > </Typography>
        )}
      </Box>
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar o cliente?"
        onClose={handleClose}
        onConfirm={handleDeleteRows}
        title="Deletar Cliente"
      />
    </>
  );
}

export default TableSearch;
