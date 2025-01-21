import type { DownloadPdfParams } from "src/models/kpiModel";
import type { SupplierBasicInfo } from "src/models/supplier";
import type { CustomerBasicInfo } from "src/models/customers";

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

import { useGetDownloadPdf } from "src/hooks/useKpi";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";
import { useGetCustomersBasicInfo } from "src/hooks/useCustomer";

import { useNotification } from "src/context/NotificationContext";

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



export default function GenerateDailyReport() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSupplier, setIsSupplier] = useState<boolean>(false);
  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm<DownloadPdfParams>({
    defaultValues: {
      month: undefined,
      year: undefined,
      personId: undefined,
    },
  });
  const downloadPdf = useGetDownloadPdf();
  const notification = useNotification();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();
  const { data: customers, isLoading: loadingCustomers } = useGetCustomersBasicInfo();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const toggleCustomerSupplier = () => {
    setIsSupplier(!isSupplier);
    setValue("personId", 0);
  };

  const onSubmit = (params: DownloadPdfParams) => {
    
    downloadPdf.mutate({ params }, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `RELATORIO-${params.month}-${params.year}-${params.personId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        notification.addNotification("Relatório gerado com sucesso!", "success");
        handleCloseModal();
      },
      onError: () => {
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
        sx={{ mt: { xs: 2, sm: 2 } }}
      >
        Gerar Relatório Diário
      </Button>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Gerar Relatório Diário</DialogTitle>
        <DialogContent sx={{ margin: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>

              {/* Campo de Mês */}
              <Grid item xs={12}>
                <Controller
                  name="month"
                  control={control}
                  rules={{ required: "Selecione um Mês" }}
                  render={({ field }) => (
                    <Autocomplete
                      options={meses} // Referência ao array de meses já definido
                      getOptionLabel={(option) => option.nome} // Exibe o nome do mês
                      isOptionEqualToValue={(option, value) => option.numero === value.numero}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.numero : undefined); // Define o número do mês no form
                      }}
                      value={meses.find((mes) => mes.numero === field.value) || null} // Sincroniza o valor com o form
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

              {/* Ano */}
              <Grid item xs={12}>
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: "Selecione um Ano" }}
                  render={({ field }) => (
                    <Autocomplete
                      options={anos} // Referencia o array de anos
                      getOptionLabel={(option) => option.ano.toString()} // Exibe o ano como texto
                      // isOptionEqualToValue={(option, value) => option.ano === value} // Compara corretamente o número do ano
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.ano : undefined); // Armazena apenas o número do ano
                      }}
                      value={anos.find((ano) => ano.ano === field.value) || null} // Sincroniza o valor com o formulário
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
                        value={
                          suppliers?.data.find(supplier => supplier.personId === field.value) || null
                        }
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
                        value={
                          suppliers?.data.find(supplier => supplier.personId === field.value) || null
                        }
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
            disabled={downloadPdf.isPending}
          >
            {downloadPdf.isPending ? (
              <CircularProgress size={20} sx={{ marginRight: "10px" }} />
            ) : null}
            Gerar Relatório
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
