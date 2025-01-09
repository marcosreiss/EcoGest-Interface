import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { useDownloadPdf } from "src/hooks/useKpi";

import { useNotification } from "src/context/NotificationContext";

export default function GenerateDailyReport() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ date: string }>();
  const notification = useNotification();
  const downloadPdf = useDownloadPdf();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: { date: string }) => {
    downloadPdf.mutate(data.date, {
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
      

      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Gerar Relatório Diário
      </Button>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Gerar Relatório Diário</DialogTitle>
        <DialogContent sx={{margin: 1}}>
          <form>
            <TextField
              label="Data"
              type="date"
              fullWidth
              sx={{margin: 1}}
              InputLabelProps={{ shrink: true }}
              defaultValue={new Date().toISOString().split("T")[0]} // Data atual como padrão
              {...register("date", { required: "A data é obrigatória" })}
            />
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
