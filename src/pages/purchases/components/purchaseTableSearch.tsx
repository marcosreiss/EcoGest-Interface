import type { Dispatch, SetStateAction } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { FilterParams } from 'src/models/filterParams';
import type { SupplierBasicInfo } from 'src/models/supplier';

import React, { useState } from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Menu, Button, Select, MenuItem, TextField, IconButton, InputLabel, FormControl, Autocomplete } from '@mui/material';

import { useGetSuppliersBasicInfo } from 'src/hooks/useSupplier';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';

interface TableSearchProps {
    selectedRows: any[];
    handleDelete: () => void;
    setPurchaseParams: Dispatch<SetStateAction<FilterParams>>;
}

enum FilterOptions {
    none,
    period,
    supplier,
    nfe,
    purchase,
    order
}

const PurchaseTableSearch: React.FC<TableSearchProps> = ({ selectedRows, handleDelete, setPurchaseParams }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filterOption, setFilterOption] = useState<FilterOptions>(FilterOptions.none);
    const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();

    // Local states for NF-e and Purchase ID inputs
    const [nfeInput, setNfeInput] = useState<string>('');
    const [purchaseIdInput, setPurchaseIdInput] = useState<string>('');

    const handleOpen = () => setDeleteModalOpen(true);
    const handleClose = () => setDeleteModalOpen(false);

    const handleDeleteRows = () => {
        handleClose();
        handleDelete();
    };
    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClearFilters = () => {
        setFilterOption(FilterOptions.none);
        setPurchaseParams((prev) => ({
            ...prev,
            startDate: null,
            endDate: null,
            personId: null,
            id: null,
            nfe: null,
            order: null,
        }));
        setNfeInput('');
        setPurchaseIdInput('');
    };

    // Handlers for applying NF-e and Purchase ID filters
    const applyNfeFilter = () => {
        setPurchaseParams((prev) => ({
            ...prev,
            nfe: nfeInput.trim() || null,
        }));
    };

    const applyPurchaseIdFilter = () => {
        const id = parseInt(purchaseIdInput, 10);
        setPurchaseParams((prev) => ({
            ...prev,
            id: Number.isNaN(id) ? null : id,
        }));
    };

    // Handler for order selection
    const handleOrderChange = (event: SelectChangeEvent<string>) => {
        const {value} = event.target;
        setPurchaseParams((prev) => ({
            ...prev,
            order: value === 'asc' ? 'asc' : value === 'desc' ? 'desc' : null,
        }));
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
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                <IconButton onClick={handleFilterClick}>
                    <FilterAltIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => { setFilterOption(FilterOptions.period); setAnchorEl(null); }}>Filtrar por Período</MenuItem>
                    <MenuItem onClick={() => { setFilterOption(FilterOptions.supplier); setAnchorEl(null); }}>Filtrar por Fornecedor</MenuItem>
                    <MenuItem onClick={() => { setFilterOption(FilterOptions.nfe); setAnchorEl(null); }}>Filtrar por NF-e</MenuItem>
                    <MenuItem onClick={() => { setFilterOption(FilterOptions.purchase); setAnchorEl(null); }}>Filtrar por Código da Compra</MenuItem>
                    <MenuItem onClick={() => { setFilterOption(FilterOptions.order); setAnchorEl(null); }}>Ordenação</MenuItem>
                </Menu>

                {/* Filtrar por Período */}
                {filterOption === FilterOptions.period && (
                    <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <TextField
                            label="Data Inicial"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            // value={setPurchaseParams ? undefined : ''}
                            onChange={(e) => setPurchaseParams((prevState) => ({
                                ...prevState,
                                startDate: e.target.value,
                            }))}
                        />
                        <TextField
                            label="Data Final"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setPurchaseParams((prevState) => ({
                                ...prevState,
                                endDate: e.target.value,
                            }))}
                        />
                    </Box>
                )}

                {/* Filtrar por Fornecedor */}
                {filterOption === FilterOptions.supplier && (
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Autocomplete
                            options={suppliers?.data || []}
                            loading={loadingSuppliers}
                            getOptionLabel={(option: SupplierBasicInfo) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.personId === value?.personId
                            }
                            onChange={(_, newValue) => setPurchaseParams((prev) => ({
                                ...prev,
                                personId: newValue?.personId || null
                            }))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Fornecedor"
                                    variant="outlined"
                                />
                            )}
                        />
                    </Box>
                )}

                {/* Filtrar por NF-e */}
                {filterOption === FilterOptions.nfe && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <TextField
                            label="NF-e"
                            variant="outlined"
                            value={nfeInput}
                            onChange={(e) => setNfeInput(e.target.value)}
                        />
                        <Button variant="contained" onClick={applyNfeFilter}>
                            Pesquisar
                        </Button>
                    </Box>
                )}

                {/* Filtrar por Código da Compra (ID) */}
                {filterOption === FilterOptions.purchase && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <TextField
                            label="Código da Compra"
                            variant="outlined"
                            type="number"
                            value={purchaseIdInput}
                            onChange={(e) => setPurchaseIdInput(e.target.value)}
                        />
                        <Button variant="contained" onClick={applyPurchaseIdFilter}>
                            Pesquisar
                        </Button>
                    </Box>
                )}

                {/* Ordenação */}
                {filterOption === FilterOptions.order && (
                    <Box sx={{ minWidth: '200px' }}>
                        <FormControl fullWidth>
                            <InputLabel id="order-select-label">Ordenação</InputLabel>
                            <Select
                                labelId="order-select-label"
                                value={undefined} // You can manage the selected value if needed
                                label="Ordenação"
                                onChange={handleOrderChange}
                            >
                                <MenuItem value="asc">Mais Antigo</MenuItem>
                                <MenuItem value="desc">Mais Recente</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Botão Limpar Filtros */}
                {filterOption !== FilterOptions.none && (
                    <Button
                        onClick={handleClearFilters}
                        variant="contained"
                        color="error"
                        sx={{
                            textTransform: 'none',
                            padding: '6px 16px',
                            borderRadius: '8px',
                        }}
                    >
                        Limpar Filtros
                    </Button>
                )}

                {/* Botão de Deletar */}
                {selectedRows.length > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            textTransform: 'none',
                            padding: '6px 16px',
                            borderRadius: '8px',
                        }}
                        onClick={handleOpen}
                    >
                        Deletar Selecionados ({selectedRows.length})
                    </Button>
                )}
            </Box>
            <ConfirmationDialog
                open={deleteModalOpen}
                confirmButtonText="Deletar"
                description="Tem certeza que você quer deletar os clientes selecionados?"
                onClose={handleClose}
                onConfirm={handleDeleteRows}
                title="Deletar Clientes"
            />
        </>
    )}

    export default PurchaseTableSearch;
