import type { Dispatch, SetStateAction } from "react";
import type { SelectChangeEvent } from "@mui/material";
import type { ReceiveParams } from "src/models/receive";

import React, { useState } from "react";

import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface TableSearchProps {
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void | null;
  selectedRows: any[];
  isSearchDisabled: boolean;
  handleDelete: () => void;
  setSearchByPeriod: Dispatch<SetStateAction<ReceiveParams>>;
}

const ReceiveTableSearch: React.FC<TableSearchProps> = ({
  handleSearchChange,
  selectedRows,
  isSearchDisabled,
  handleDelete,
  setSearchByPeriod,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [status, setStatus] = useState<"Todos" | "Pago" | "Atrasado" | "Aberto">("Todos");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleOpen = () => setDeleteModalOpen(true);
  const handleClose = () => setDeleteModalOpen(false);

  const handleDeleteRows = () => {
    handleClose();
    handleDelete();
  };

  const handleStatusChange = (event: SelectChangeEvent<"Todos" | "Pago" | "Atrasado" | "Aberto">) => {
    const selectedStatus = event.target.value as "Todos" | "Pago" | "Atrasado" | "Aberto";
    setStatus(selectedStatus);
    setSearchByPeriod((prevState) => ({
      ...prevState,
      status: selectedStatus === "Todos" ? null : selectedStatus,
    }));
  };

  const clearPeriodFilters = () => {
    setStatus("Todos");
    setStartDate(null);
    setEndDate(null);
    setSearchByPeriod((prevState) => ({
      ...prevState,
      startDate: null,
      endDate: null,
      status: null
    }));
  };

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
              startDate: value,
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
              endDate: value,
            }));
          }}
        />

        {/* Select de Status */}
        <FormControl fullWidth size="small">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Pago">Pago</MenuItem>
            <MenuItem value="Atrasado">Atrasado</MenuItem>
            <MenuItem value="Aberto">Aberto</MenuItem>
          </Select>
        </FormControl>

        {/* Botão para limpar filtros de período */}
        {(startDate || endDate || status !== "Todos") && (
          <Button
            sx={{ width: 500 }}
            variant="outlined"
            color="primary"
            size="small"
            onClick={clearPeriodFilters}
          >
            Limpar Filtros
          </Button>
        )}

        {/* Botão de Deletar Selecionados */}
        {selectedRows.length > 0 && (
          <Button
            variant="contained"
            color="error"
            size="medium"
            onClick={handleOpen}
          >
            Deletar Selecionados ({selectedRows.length})
          </Button>
        )}
      </Box>

      {/* Modal de Confirmação para Deletar */}
      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar os registros selecionados?"
        onClose={handleClose}
        onConfirm={handleDeleteRows}
        title="Deletar Registros"
      />
    </>
  );
};

export default ReceiveTableSearch;
