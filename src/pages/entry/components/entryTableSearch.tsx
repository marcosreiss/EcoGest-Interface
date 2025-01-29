import type { Dispatch, SetStateAction } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { EntryPaginatedParams } from 'src/models/entry';

import React, { useState } from 'react';

import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Autocomplete,
} from '@mui/material';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';

interface TableSearchProps {
  selectedRows: any[];
  handleDelete: () => void;
  setSearchByPeriod: Dispatch<SetStateAction<EntryPaginatedParams>>;
}

const predefinedSubtypes = [
  "Peças e Serviços",
  "Folha de pagamento",
  "Diárias",
  "Mercedes 710 - HPP1C70",
  "Mercedes 709 - JKW6I19",
  "Mercedes 708 - LVR7727",
  "Imposto ICMS Frete",
  "Pag Frete",
  "Vale Transporte",
  "Impostos Federais",
  "Trabalhos Profissionais",
  "Suprimentos",
  "EPIs",
  "Manutenção Prensa",
  "Manutenção Empilhadeira",
  "Pagamento a fornecedores",
  "Gastos com energia e internet",
  "Sócios",
  "Outro"
];

const EntryTableSearch: React.FC<TableSearchProps> = ({
  selectedRows,
  handleDelete,
  setSearchByPeriod,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subtype, setSubtype] = useState<string | "Todos">("Todos");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleOpen = () => setDeleteModalOpen(true);
  const handleClose = () => setDeleteModalOpen(false);

  const handleDeleteRows = () => {
    handleClose();
    handleDelete();
  };
  const handleSubtypeChange = (newSubtype: string) => {
    setSubtype(newSubtype);
    setSearchByPeriod((prevState) => ({
      ...prevState,
      subtype: newSubtype === "Todos" ? null : newSubtype,
    }));
  };
  
  const clearFilters = () => {
    setSubtype("Todos");
    setStartDate(null);
    setEndDate(null);
    setSearchByPeriod((prevState) => ({
      ...prevState,
      subtype: null,
      startDate: null,
      endDate: null,
    }));
  };

  const isFilterActive = subtype !== "Todos" || startDate !== null || endDate !== null;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e0e0e0",
          borderRadius: "8px 8px 0 0",
          minHeight: "70px",
          gap: "16px",
        }}
      >
        {/* Campo para Data Inicial */}
        <TextField
          fullWidth
          label="Data Inicial"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate || ""}
          onChange={(e) => {
            const { value } = e.target;
            setStartDate(value);
            setSearchByPeriod((prevState) => ({
              ...prevState,
              startDate: value || null,
            }));
          }}
        />

        {/* Campo para Data Final */}
        <TextField
          fullWidth
          label="Data Final"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate || ""}
          onChange={(e) => {
            const { value } = e.target;
            setEndDate(value);
            setSearchByPeriod((prevState) => ({
              ...prevState,
              endDate: value || null,
            }));
          }}
        />

        <FormControl fullWidth size="small">
          <Autocomplete
            freeSolo // Permite inserção manual de texto
            options={predefinedSubtypes} // Sugestões pré-definidas
            value={subtype}
            onChange={(_, newValue) => handleSubtypeChange(newValue || "")} // Passa o valor diretamente
            renderInput={(params) => (
              <TextField {...params} label="Tipo" variant="outlined" />
            )}
          />
        </FormControl>



        {/* Botão para limpar filtros */}
        {isFilterActive && (
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            onClick={clearFilters}
            sx={{ minWidth: '150px' }}
          >
            Limpar Filtros
          </Button>
        )}

        {/* Botão de Deletar Selecionados */}
        {selectedRows.length > 0 && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleOpen}
            sx={{ minWidth: '200px' }}
          >
            Deletar Selecionados ({selectedRows.length})
          </Button>
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

export default EntryTableSearch;
