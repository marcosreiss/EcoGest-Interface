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

import { useGetDownloadPdf } from "src/hooks/useKpi";
import { useGetSuppliersBasicInfo } from "src/hooks/useSupplier";

import { useNotification } from "src/context/NotificationContext";

export interface SupplierBasicInfo {
  personId: number;
  name: string;
}

export interface SuppliersBasicInfoList {
  data: SupplierBasicInfo[];
}

export default function GenerateDailyReport() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<{ date: string; personId?: number }>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      personId: undefined,
    },
  });
  const downloadPdf = useGetDownloadPdf();
  const notification = useNotification();
  const { data: suppliers, isLoading: loadingSuppliers } = useGetSuppliersBasicInfo();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: { date: string; personId?: number }) => {
    downloadPdf.mutate(data, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `RELATORIO-${data.date}.pdf`;
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

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Gerar Relatório Diário</DialogTitle>
        <DialogContent sx={{ margin: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Campo de Data */}
              <Grid item xs={12} marginTop={1}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "A data é obrigatória" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Data"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campo de Fornecedor (Autocomplete) */}
              <Grid item xs={12}>
                <Controller
                  name="personId"
                  control={control}
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
                          label="Fornecedor (Opcional)"
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
