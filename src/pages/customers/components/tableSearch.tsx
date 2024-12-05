import React from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';

const TableSearch = ({ selectedCount }: { selectedCount: number }) => (
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
          InputProps={{
            sx: {
              borderRadius: '8px',
              backgroundColor: 'white',
            },
          }}
        />
      </Box>

      {/* Botão de Deletar */}
      {selectedCount > 0 ? (
        <Button
          variant="contained"
          color="error"
          sx={{
            textTransform: 'none',
            marginLeft: '16px',
            padding: '6px 16px',
            borderRadius: '8px',
          }}
        >
          Delete Selected ({selectedCount})
        </Button>
      ) : (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ marginLeft: '16px' }}
        >
          No items selected
        </Typography>
      )}
    </Box>
  );

export default TableSearch;
