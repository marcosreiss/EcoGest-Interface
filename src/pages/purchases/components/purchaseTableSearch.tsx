import type { Dispatch, SetStateAction } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { SupplierBasicInfo } from 'src/models/supplier';
import type { CustomerBasicInfo } from 'src/models/customers';

import React, { useState, useEffect } from 'react';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Menu, Button, Select, MenuItem, Checkbox, TextField, InputLabel, FormControl, Autocomplete, ListItemText } from '@mui/material';

import { useGetSuppliersBasicInfo } from 'src/hooks/useSupplier';
import { useGetCustomersBasicInfo } from 'src/hooks/useCustomer';

import { EntityType, FilterOptions, type FilterParams } from 'src/models/filterParams';

import ConfirmationDialog from 'src/components/confirmation-dialog/confirmationDialog';



interface FilterTableProps {
    selectedRows: any[];
    handleDelete: () => void;
    setParams: Dispatch<SetStateAction<FilterParams>>;
    entityType: EntityType;
}



const FilterTableComponent: React.FC<FilterTableProps> = ({ selectedRows, handleDelete, setParams, entityType }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [filterOption, setFilterOption] = useState<FilterOptions[]>([]);
    const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
    const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();
    const [startDateValue, setStartDate] = useState('');
    const [endDateValue, setEndDate] = useState('');

    useEffect(() => {
        if (startDateValue && endDateValue) {
            setParams((prevState) => ({
                ...prevState,
                startDate: startDateValue,
                endDate: endDateValue
            }));
        } else {
            setParams((prevState) => ({
                ...prevState,
                startDate: null,
                endDate: null
            }));
        }
    }, [endDateValue, setParams, startDateValue]);

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
        setParams((prev) => (
            {
                ...prev,
                nfe: null,
                order: null,
                personId: null,
                id: null,
                startDate: null,
                endDate: null,
                dataVencimento: null,
                status: null,
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
        setParams((prev) => ({
            ...prev,
            nfe: nfeInput.trim() || null,
        }));
    };

    const applyPurchaseIdFilter = () => {
        const id = parseInt(purchaseIdInput, 10);
        setParams((prev) => ({
            ...prev,
            id: Number.isNaN(id) ? null : id,
        }));
    };

    // Handler for order selection
    const handleOrderChange = (event: SelectChangeEvent<string>) => {
        const { value } = event.target;
        setOrderValue(value);
        setParams((prev) => ({
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
                    <MenuItem
                        onClick={() => toggleFilter(FilterOptions.period)}
                        disabled={
                            filterOption.includes(FilterOptions.purchase) ||
                            filterOption.includes(FilterOptions.sale) ||
                            filterOption.includes(FilterOptions.payable) ||
                            filterOption.includes(FilterOptions.receive) ||
                            filterOption.includes(FilterOptions.nfe)
                        }
                    >
                        <Checkbox
                            checked={filterOption.includes(FilterOptions.period)}
                        />
                        <ListItemText primary="Filtrar por Período" />
                    </MenuItem>

                    {(entityType === EntityType.receive || entityType === EntityType.payable) && (
                        <MenuItem
                            onClick={() => toggleFilter(FilterOptions.dataVencimento)}
                            disabled={
                                filterOption.includes(FilterOptions.purchase) ||
                                filterOption.includes(FilterOptions.nfe)
                            }
                        >
                            <Checkbox checked={filterOption.includes(FilterOptions.supplier)} />
                            <ListItemText primary="Filtrar por Data de Vencimento" />
                        </MenuItem>
                    )}

                    {(entityType === EntityType.purchase || EntityType.payable) && (
                        <MenuItem
                            onClick={() => toggleFilter(FilterOptions.supplier)}
                            disabled={filterOption.includes(FilterOptions.purchase) || filterOption.includes(FilterOptions.nfe)}
                        >
                            <Checkbox checked={filterOption.includes(FilterOptions.supplier)} />
                            <ListItemText primary="Filtrar por Fornecedor" />
                        </MenuItem>
                    )}

                    {(entityType === EntityType.sale || entityType === EntityType.receive) && (
                        <MenuItem
                            onClick={() => toggleFilter(FilterOptions.customer)}
                            disabled={
                                filterOption.includes(FilterOptions.sale) ||
                                filterOption.includes(FilterOptions.nfe)
                            }
                        >
                            <Checkbox checked={filterOption.includes(FilterOptions.customer)} />
                            <ListItemText primary="Filtrar por Cliente" />
                        </MenuItem>
                    )}

                    {entityType === EntityType.purchase && (
                        <MenuItem
                            onClick={() => toggleFilter(FilterOptions.nfe)}
                            disabled={
                                filterOption.includes(FilterOptions.period) ||
                                filterOption.includes(FilterOptions.purchase) ||
                                filterOption.includes(FilterOptions.supplier) ||
                                filterOption.includes(FilterOptions.customer)
                            }
                        >
                            <Checkbox checked={filterOption.includes(FilterOptions.nfe)} />
                            <ListItemText primary="Filtrar por NF-e" />
                        </MenuItem>
                    )}

                    {(entityType === EntityType.receive || entityType === EntityType.payable) && (
                        <MenuItem
                            onClick={() => toggleFilter(FilterOptions.status)}
                            disabled={
                                filterOption.includes(FilterOptions.purchase) ||
                                filterOption.includes(FilterOptions.supplier) ||
                                filterOption.includes(FilterOptions.customer)
                            }
                        >
                            <Checkbox checked={filterOption.includes(FilterOptions.nfe)} />
                            <ListItemText primary="Filtrar por Status" />
                        </MenuItem>
                    )}

                    <MenuItem
                        onClick={() => {
                            switch (entityType) {
                                case EntityType.purchase:
                                    toggleFilter(FilterOptions.purchase)
                                    break;
                                case EntityType.sale:
                                    toggleFilter(FilterOptions.sale);
                                    break;
                                case EntityType.payable:
                                    toggleFilter(FilterOptions.payable)
                                    break;
                                case EntityType.receive:
                                    toggleFilter(FilterOptions.receive)
                                    break;
                                default:
                                    console.log("erro na filtragem");
                            }
                        }}
                        disabled={
                            filterOption.includes(FilterOptions.period) ||
                            filterOption.includes(FilterOptions.nfe) ||
                            filterOption.includes(FilterOptions.supplier) ||
                            filterOption.includes(FilterOptions.customer)
                        }
                    >
                        <Checkbox checked={
                            filterOption.includes(FilterOptions.purchase) ||
                            filterOption.includes(FilterOptions.sale) ||
                            filterOption.includes(FilterOptions.payable) ||
                            filterOption.includes(FilterOptions.receive)
                        } />
                        <ListItemText primary="Filtrar por Código" />
                    </MenuItem>


                </Menu>

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

                {filterOption.includes(FilterOptions.dataVencimento) && (
                    <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <TextField
                            label="Data de Vencimento"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={startDateValue}
                            onChange={(e) => setParams((prev)=> ({
                                ...prev,
                                dataVencimento: e.target.value
                            }))}
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
                            onChange={(_, newValue) => setParams((prev) => ({
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

                {/* Filtrar por Cliente */}
                {filterOption.includes(FilterOptions.customer) && (
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Autocomplete
                            options={customers?.data || []}
                            loading={loadingCustomers}
                            getOptionLabel={(option: CustomerBasicInfo) => option.name}
                            isOptionEqualToValue={(option, value) =>
                                option.personId === value?.personId
                            }
                            onChange={(_, newValue) => setParams((prev) => ({
                                ...prev,
                                customerId: newValue?.personId || null
                            }))}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cliente"
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

                {filterOption.includes(FilterOptions.status) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status-select"
                                value="Todos"
                                label="Status"
                                onChange={(event) => setParams((prev) => ({
                                    ...prev,
                                    status: event.target.value === "Todos" ? null : event.target.value as "Pago" | "Atrasado" | "Aberto" | null
                                }))}
                            >
                                <MenuItem value="Todos">Todos</MenuItem>
                                <MenuItem value="Pago">Pago</MenuItem>
                                <MenuItem value="Atrasado">Atrasado</MenuItem>
                                <MenuItem value="Aberto">Aberto</MenuItem>
                            </Select>
                        </FormControl>

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

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Ordenação */}
                    <Box sx={{ minWidth: '200px' }}>
                        <FormControl fullWidth>
                            <InputLabel id="order-select-label">Ordenação</InputLabel>
                            <Select
                                labelId="order-select-label"
                                value={orderValue}
                                label="Ordenação"
                                onChange={handleOrderChange}
                            >
                                <MenuItem value="asc">Mais Antigo</MenuItem>
                                <MenuItem value="desc">Mais Recente</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Botão Limpar Filtros */}
                    <Button
                        onClick={handleClearFilters}
                        variant="contained"
                        color="error"
                        sx={{
                            textTransform: 'none',
                            padding: '6px 16px',
                            borderRadius: '8px',
                        }}
                        disabled={filterOption.length === 0}
                    >
                        Limpar Filtros
                    </Button>
                </Box>

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
                description={`Tem certeza que você quer deletar os ${entityType === EntityType.purchase ? 'fornecedores' : 'clientes'} selecionados?`}
                onClose={handleClose}
                onConfirm={handleDeleteRows}
                title={`Deletar ${entityType === EntityType.purchase ? 'Fornecedores' : 'Clientes'}`}
            />
        </>
    )
}

export default FilterTableComponent;
