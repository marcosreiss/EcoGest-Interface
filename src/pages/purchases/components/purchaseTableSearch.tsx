import type { Dispatch, SetStateAction } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { FilterParams } from 'src/models/filterParams';
import type { SupplierBasicInfo } from 'src/models/supplier';

import React, { useState, useEffect } from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Menu, Button, Select, MenuItem, Checkbox, TextField, InputLabel, FormControl, Autocomplete, ListItemText } from '@mui/material';

import { useGetSuppliersBasicInfo } from 'src/hooks/useSupplier';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';

interface TableSearchProps {
    selectedRows: any[];
    handleDelete: () => void;
    setPurchaseParams: Dispatch<SetStateAction<FilterParams>>;
}

enum FilterOptions {
    period,
    supplier,
    nfe,
    purchase,
    order
}

const PurchaseTableSearch: React.FC<TableSearchProps> = ({ selectedRows, handleDelete, setPurchaseParams }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filterOption, setFilterOption] = useState<FilterOptions[]>([]);
    const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
    const [startDateValue, setStartDate] = useState('');
    const [endDateValue, setEndDate] = useState('');

    useEffect(() => {
        if (startDateValue && endDateValue) {
            setPurchaseParams((prevState) => ({
                ...prevState,
                startDate: startDateValue,
                endDate: endDateValue
            }));
        } else {
            setPurchaseParams((prevState) => ({
                ...prevState,
                startDate: null,
                endDate: null
            }));
        }
    }, [endDateValue, setPurchaseParams, startDateValue]);

    // Local states for NF-e and Purchase ID inputs
    const [nfeInput, setNfeInput] = useState<string>('');
    const [purchaseIdInput, setPurchaseIdInput] = useState<string>('');
    const [orderValue, setOrderValue] = useState<string>('');

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
        setFilterOption([]);
        setPurchaseParams((prev)=>(
            {
                ...prev,
                nfe: null,
                order: null,
                personId: null,
                id: null,
                startDate: null,
                endDate: null,
            }
        ));
        setNfeInput('');
        setPurchaseIdInput('');
        setStartDate("");
        setEndDate("");
        setOrderValue("");
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
        const { value } = event.target;
        setOrderValue(value);
        setPurchaseParams((prev) => ({
            ...prev,
            order: value === 'asc' ? 'asc' : value === 'desc' ? 'desc' : null,
        }));
    };

    // Toggle filter option
    const toggleFilter = (option: FilterOptions) => {
        setFilterOption((prev) =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
        setAnchorEl(null); // Close the menu after selection
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
                    borderRadius: '8px 8px 0 0',
                    minHeight: '70px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                <Button
                    variant="text"
                    startIcon={<FilterAltIcon />}
                    onClick={handleFilterClick}
                    color='inherit'
                >
                    Filtros
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => toggleFilter(FilterOptions.period)}>
                        <Checkbox checked={filterOption.includes(FilterOptions.period)} />
                        <ListItemText primary="Filtrar por Período" />
                    </MenuItem>
                    <MenuItem onClick={() => toggleFilter(FilterOptions.supplier)}>
                        <Checkbox checked={filterOption.includes(FilterOptions.supplier)} />
                        <ListItemText primary="Filtrar por Fornecedor" />
                    </MenuItem>
                    <MenuItem onClick={() => toggleFilter(FilterOptions.nfe)}>
                        <Checkbox checked={filterOption.includes(FilterOptions.nfe)} />
                        <ListItemText primary="Filtrar por NF-e" />
                    </MenuItem>
                    <MenuItem onClick={() => toggleFilter(FilterOptions.purchase)}>
                        <Checkbox checked={filterOption.includes(FilterOptions.purchase)} />
                        <ListItemText primary="Filtrar por Código da Compra" />
                    </MenuItem>
                    <MenuItem onClick={() => toggleFilter(FilterOptions.order)}>
                        <Checkbox checked={filterOption.includes(FilterOptions.order)} />
                        <ListItemText primary="Ordenação" />
                    </MenuItem>
                </Menu>

                {/* Render active filters */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {/* Filtrar por Período */}
                    {filterOption.includes(FilterOptions.period) && (
                        <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <TextField
                                label="Data Inicial"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={startDateValue}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <TextField
                                label="Data Final"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={endDateValue}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Box>
                    )}

                    {/* Filtrar por Fornecedor */}
                    {filterOption.includes(FilterOptions.supplier) && (
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
                    {filterOption.includes(FilterOptions.nfe) && (
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
                    {filterOption.includes(FilterOptions.purchase) && (
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
                    {filterOption.includes(FilterOptions.order) && (
                        <Box sx={{ minWidth: '200px' }}>
                            <FormControl fullWidth>
                                <InputLabel id="order-select-label">Ordenação</InputLabel>
                                <Select
                                    labelId="order-select-label"
                                    value={orderValue}
                                    label="Ordenação"
                                    onChange={handleOrderChange}
                                >
                                    <MenuItem value="asc">Mais Recente</MenuItem>
                                    <MenuItem value="desc">Mais Antigo</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </Box>

                {/* Botão Limpar Filtros */}
                {filterOption.length > 0 && (
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

