
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import DownloadIcon from "@mui/icons-material/Download";
import {
  Grid,
  Button,
  Dialog,
  Switch,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";

import { useGetEntryRelatoryByMonth, useGetEntryRelatoryByPeriod } from "src/hooks/useEntry";

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

interface FormValues {
  // Para o modo mês
  month?: number;
  year?: number;
  // Para o modo período
  startDate?: string;
  endDate?: string;
  // Campo compartilhado
  subtype: string;
}

export default function GenerateEntryRelatory() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPeriod, setIsPeriod] = useState<boolean>(false); // Toggle entre mês e período

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      month: undefined,
      year: undefined,
      startDate: undefined,
      endDate: undefined,
      subtype: "",
    },
  });

  const getEntryRelatoryByMonth = useGetEntryRelatoryByMonth();
  const getEntryRelatoryByPeriod = useGetEntryRelatoryByPeriod();
  const notification = useNotification();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setIsPeriod(false);
  };

  const toggleMonthPeriod = () => {
    setIsPeriod(!isPeriod);
    // Reseta os campos que não serão usados
    if (!isPeriod) {
      setValue("month", undefined);
      setValue("year", undefined);
    } else {
      setValue("startDate", undefined);
      setValue("endDate", undefined);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (isPeriod) {
      if (!data.startDate || !data.endDate) {
        notification.addNotification("Preencha as datas de início e fim.", "error");
        return;
      }
      const params = {
        startDate: data.startDate,
        endDate: data.endDate,
        subtype: data.subtype,
      };
      getEntryRelatoryByPeriod.mutate(params, {
        onSuccess: (file) => {
          const url = window.URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = `RELATORIO-${data.startDate}-${data.endDate}-${data.subtype}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);

          notification.addNotification("Relatório gerado com sucesso!", "success");
          handleCloseModal();
        },
        onError: () => {
          notification.addNotification("Erro ao gerar o relatório.", "error");
        },
      });
    } else {
      if (!data.month || !data.year) {
        notification.addNotification("Selecione o mês e o ano.", "error");
        return;
      }
      const params = {
        month: data.month,
        year: data.year,
        subtype: data.subtype,
      };
      getEntryRelatoryByMonth.mutate(params, {
        onSuccess: (file) => {
          const url = window.URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = `RELATORIO-${data.month}-${data.year}-${data.subtype}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);

          notification.addNotification("Relatório gerado com sucesso!", "success");
          handleCloseModal();
        },
        onError: () => {
          notification.addNotification("Erro ao gerar o relatório.", "error");
        },
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        startIcon={<DownloadIcon />}
      >
        Gerar Relatório de Lançamento
      </Button>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Gerar Relatório de Lançamento</DialogTitle>
        <DialogContent sx={{ margin: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Toggle Mês / Período */}
              <Grid item xs={12}>
                <Typography component="span" fontSize={13.6} marginRight={2}>
                  Mês
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPeriod}
                      onChange={toggleMonthPeriod}
                      color="primary"
                    />
                  }
                  label="Período"
                />
              </Grid>

              {/* Campo de Tipo (Subtipo) */}
              <Grid item xs={12} sx={{ marginTop: 1 }}>
                <Controller
                  name="subtype"
                  control={control}
                  rules={{ required: "Selecione ou digite um Tipo" }}
                  render={({ field }) => (
                    <Autocomplete
                      freeSolo
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

              {/* Renderiza os campos de Mês e Ano se não estiver no modo Período */}
              {!isPeriod && (
                <>
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
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
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
                </>
              )}

              {/* Renderiza os campos de Período se estiver no modo Período */}
              {isPeriod && (
                <>
                  <Grid item xs={12}>
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{ required: "Data de início é obrigatória" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Data de Início"
                          type="date"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.startDate}
                          helperText={errors.startDate?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="endDate"
                      control={control}
                      rules={{ required: "Data de fim é obrigatória" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Data de Fim"
                          type="date"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.endDate}
                          helperText={errors.endDate?.message}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
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
            disabled={getEntryRelatoryByMonth.isPending}
          >
            {getEntryRelatoryByMonth.isPending && (
              <CircularProgress size={20} sx={{ marginRight: "10px" }} />
            )}
            Gerar Relatório
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
