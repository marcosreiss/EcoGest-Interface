
import type { Customer } from 'src/models/customers';

import React, { useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

import { useDeleteCustomer } from 'src/hooks/useCustomer';

import { useNotification } from 'src/context/NotificationContext';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';



interface TableSearchProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCustomers: Customer[];
}

const TableSearch: React.FC<TableSearchProps> = ({ handleSearchChange, selectedCustomers }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteCustomer = useDeleteCustomer();
  const notification = useNotification();
  
  const handleOpen = () => setDeleteModalOpen(true);
  const handleClose = () => setDeleteModalOpen(false);

  const handleDeleteCustomer = () => {
    handleClose();
    selectedCustomers.forEach((customer) => {
      deleteCustomer.mutate(customer.customerId, {
        onSuccess: () => {
          notification.addNotification('Clientes deletado com sucesso', 'success');
          setDeleteModalOpen(false);
        },
        onError: () => {
          notification.addNotification('Erro ao deletar cliente, tente novamente mais tarde', 'error');
        },
      });
    });
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
            placeholder="Search..."
            variant="outlined"
            size="small"
            onChange={handleSearchChange}
            InputProps={{
              sx: {
                borderRadius: '8px',
                backgroundColor: 'white',
              },
            }}
          />
        </Box>

        {/* Botão de Deletar */}
        {selectedCustomers.length > 0 ? (
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
            Delatar Selecionados ({selectedCustomers.length})
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
        onConfirm={handleDeleteCustomer}
        title="Deletar Cliente"
      />
    </>
  );
}

export default TableSearch;
