import type { EntryRelatoryRequestParams } from "src/models/entry";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import DownloadIcon from "@mui/icons-material/Download";
import {
    Grid,
    Button,
    Dialog,
    TextField,
    DialogTitle,
    Autocomplete,
    DialogActions,
    DialogContent,
    CircularProgress,
} from "@mui/material";

import { useGetEntryRelatory } from "src/hooks/useEntry";

import { useNotification } from "src/context/NotificationContext";

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

const meses = [
    { nome: "Janeiro", numero: 1 },
    { nome: "Fevereiro", numero: 2 },
    { nome: "Março", numero: 3 },
    { nome: "Abril", numero: 4 },
    { nome: "Maio", numero: 5 },
    { nome: "Junho", numero: 6 },
    { nome: "Julho", numero: 7 },
    { nome: "Agosto", numero: 8 },
    { nome: "Setembro", numero: 9 },
    { nome: "Outubro", numero: 10 },
    { nome: "Novembro", numero: 11 },
    { nome: "Dezembro", numero: 12 },
];

const anos = Array.from({ length: 10 }, (_, i) => {
    const ano = new Date().getFullYear() - i;
    return { ano };
});

export default function GenerateEntryRelatory() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { control, handleSubmit, reset, formState: { errors } } = useForm<EntryRelatoryRequestParams>({
        defaultValues: {
            month: undefined,
            year: undefined,
            subtype: "",
        },
    });

    const getEntryRelatory = useGetEntryRelatory();
    const notification = useNotification();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = (params: EntryRelatoryRequestParams) => {
        getEntryRelatory.mutate(params, {
            onSuccess: (file) => {
                const url = window.URL.createObjectURL(file);
                const link = document.createElement("a");
                link.href = url;
                link.download = `RELATORIO-${params.month}-${params.year}-${params.subtype}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);

                notification.addNotification("Relatório gerado com sucesso!", "success");
                handleCloseModal();
            },
            onError: (error) => {
                notification.addNotification("Erro ao gerar o relatório.", "error");
            },
        });
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModal}
                startIcon={<DownloadIcon />}
            // sx={{ mt: { xs: 2, sm: 2 } }}
            >
                Gerar Relatório de Lançamento
            </Button>

            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>Gerar Relatório de Lançamento</DialogTitle>
                <DialogContent sx={{ margin: 1 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>

                            {/* Campo de Tipo (Subtipo) */}
                            <Grid item xs={12} sx={{ marginTop: 1 }}>
                                <Controller
                                    name="subtype"
                                    control={control}
                                    rules={{ required: "Selecione ou digite um Tipo" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            freeSolo // Permite inserir texto manualmente
                                            options={predefinedSubtypes}
                                            getOptionLabel={(option) => option}
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue || "");
                                            }}
                                            value={field.value || ""}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tipo"
                                                    variant="outlined"
                                                    error={!!errors.subtype}
                                                    helperText={errors.subtype?.message}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Campo de Mês */}
                            <Grid item xs={12}>
                                <Controller
                                    name="month"
                                    control={control}
                                    rules={{ required: "Selecione um Mês" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            options={meses}
                                            getOptionLabel={(option) => option.nome}
                                            isOptionEqualToValue={(option, value) => option.numero === value.numero}
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue ? newValue.numero : undefined);
                                            }}
                                            value={meses.find((mes) => mes.numero === field.value) || null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Mês"
                                                    variant="outlined"
                                                    error={!!errors.month}
                                                    helperText={errors.month?.message}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Campo de Ano */}
                            <Grid item xs={12}>
                                <Controller
                                    name="year"
                                    control={control}
                                    rules={{ required: "Selecione um Ano" }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            options={anos}
                                            getOptionLabel={(option) => option.ano.toString()}
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue ? newValue.ano : undefined);
                                            }}
                                            value={anos.find((ano) => ano.ano === field.value) || null}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Ano"
                                                    variant="outlined"
                                                    error={!!errors.year}
                                                    helperText={errors.year?.message}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        color="primary"
                        disabled={getEntryRelatory.isPending}
                    >
                        {getEntryRelatory.isPending ? (
                            <CircularProgress size={20} sx={{ marginRight: "10px" }} />
                        ) : null}
                        Gerar Relatório
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
