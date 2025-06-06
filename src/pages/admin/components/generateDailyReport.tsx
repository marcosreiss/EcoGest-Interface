import type { SupplierBasicInfo } from "src/models/supplier";
import type { CustomerBasicInfo } from "src/models/customers";
import type { DownloadPdfByMonth, DownloadPdfByPeriod } from "src/models/kpiModel";

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

import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";
import { useGetCustomersBasicInfo } from "src/hooks/useCustomer";
import { useGetDownloadPdfByMonth, useGetDownloadPdfByPeriod } from "src/hooks/useKpi";

import { useNotification } from "src/context/NotificationContext";

import PdfViewerModal from "src/components/PdfViewerModal";

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

// Utilizaremos um formulário que abrange ambos os cenários, mas renderizando apenas os campos relevantes
interface FormValues {
  // Campos para modo Mês
  month?: number;
  year?: number;
  // Campos para modo Período
  startDate?: string;
  endDate?: string;
  // Campo compartilhado
  personId?: number;
}

export default function GenerateDailyReport() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSupplier, setIsSupplier] = useState<boolean>(false);
  const [isPeriod, setIsPeriod] = useState<boolean>(false); // Toggle entre mês e período
  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      month: undefined,
      year: undefined,
      startDate: undefined,
      endDate: undefined,
      personId: undefined,
    },
  });
  const downloadPdfByMonth = useGetDownloadPdfByMonth();
  const downloadPdfByPeriod = useGetDownloadPdfByPeriod();
  const notification = useNotification();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    // Reseta os toggles se necessário
    setIsPeriod(false);
    setIsSupplier(false);
  };

  const toggleCustomerSupplier = () => {
    setIsSupplier(!isSupplier);
    setValue("personId", undefined);
  };

  // Toggle entre modo Mês e Período
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

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const onSubmit = (data: FormValues) => {
    if (isPeriod) {
      if (!data.startDate || !data.endDate) {
        notification.addNotification("Preencha as datas de início e fim.", "error");
        return;
      }

      const params: DownloadPdfByPeriod = {
        startDate: data.startDate,
        endDate: data.endDate,
        personId: data.personId,
      };

      downloadPdfByPeriod.mutate({ params }, {
        onSuccess: (blob) => {
          setPdfBlob(blob);
          setPdfFileName(`RELATORIO-${data.startDate}-${data.endDate}-${data.personId}.pdf`);
          setPdfModalOpen(true);
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

      const params: DownloadPdfByMonth = {
        month: data.month,
        year: data.year,
        personId: data.personId,
      };

      downloadPdfByMonth.mutate({ params }, {
        onSuccess: (blob) => {
          setPdfBlob(blob);
          setPdfFileName(`RELATORIO-${data.month}-${data.year}-${data.personId}.pdf`);
          setPdfModalOpen(true);
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
        sx={{ mt: { xs: 2, sm: 2 } }}
      >
        Gerar Relatório Diário
      </Button>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Gerar Relatório Diário</DialogTitle>
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

              {/* Renderiza os campos de Mês e Ano se não estiver no modo Período */}
              {!isPeriod && (
                <>
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
                </>
              )}

              {/* Renderiza os campos de Período se estiver no modo Período */}
              {isPeriod && (
                <>
                  {/* Data de Início */}
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

                  {/* Data de Fim */}
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

              {/* Toggle Cliente/Fornecedor */}
              <Grid item xs={12}>
                <Typography component="span" fontSize={13.6} marginRight={2}>
                  Cliente
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSupplier}
                      onChange={toggleCustomerSupplier}
                      color="primary"
                    />
                  }
                  label="Fornecedor"
                />
              </Grid>

              {/* Campo de Fornecedor (Autocomplete) */}
              {isSupplier && (
                <Grid item xs={12}>
                  <Controller
                    name="personId"
                    control={control}
                    rules={isSupplier ? { required: "O fornecedor é obrigatório" } : undefined}
                    render={({ field }) => (
                      <Autocomplete
                        options={suppliers?.data || []}
                        loading={loadingSuppliers}
                        getOptionLabel={(option: SupplierBasicInfo) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.personId === value.personId
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.personId : undefined);
                        }}
                        value={suppliers?.data.find(supplier => supplier.personId === field.value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Fornecedor"
                            variant="outlined"
                            error={!!errors.personId}
                            helperText={errors.personId?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loadingSuppliers ? <CircularProgress size={20} /> : null}
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
              )}

              {/* Campo de Cliente (Autocomplete) */}
              {!isSupplier && (
                <Grid item xs={12}>
                  <Controller
                    name="personId"
                    control={control}
                    rules={!isSupplier ? { required: "O cliente é obrigatório" } : undefined}
                    render={({ field }) => (
                      <Autocomplete
                        options={customers?.data || []}
                        loading={loadingCustomers}
                        getOptionLabel={(option: CustomerBasicInfo) => option.name}
                        isOptionEqualToValue={(option, value) =>
                          option.personId === value.personId
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.personId : undefined);
                        }}
                        value={customers?.data.find(customer => customer.personId === field.value) || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cliente"
                            variant="outlined"
                            error={!!errors.personId}
                            helperText={errors.personId?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loadingCustomers ? <CircularProgress size={20} /> : null}
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
            disabled={downloadPdfByMonth.isPending || downloadPdfByPeriod.isPending}
          >
            {(downloadPdfByMonth.isPending || downloadPdfByPeriod.isPending) ? (
              <CircularProgress size={20} sx={{ marginRight: "10px" }} />
            ) : null}
            Gerar Relatório
          </Button>
        </DialogActions>
      </Dialog>

      {pdfBlob && (
        <PdfViewerModal
          open={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          blob={pdfBlob}
          fileName={pdfFileName}
        />
      )}

    </>
  );
}
