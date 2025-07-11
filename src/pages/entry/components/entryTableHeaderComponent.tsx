import type { CustomEntryReceiptInfo } from "src/models/entry";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import DownloadIcon from "@mui/icons-material/Download";
import {
  Grid,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import { useGenerateCustomExpenseReceipt } from "src/hooks/useEntry";

import { useNotification } from "src/context/NotificationContext";

import PdfViewerModal from "src/components/PdfViewerModal";

import GenerateEntryRelatory from "./generateEntryRelatory";

interface HeaderComponentProps {
  title: string;
  addButtonName: string;
  addButtonPath: string;
}

const ExpensesTableHeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  addButtonName,
  addButtonPath,
}) => {
  const { register, handleSubmit, reset } = useForm<CustomEntryReceiptInfo>();
  const [open, setOpen] = useState(false);
  const generateReceipt = useGenerateCustomExpenseReceipt();
  const notification = useNotification();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const onSubmit = async (data: CustomEntryReceiptInfo) => {
    generateReceipt.mutate(data, {
      onSuccess: (receipt) => {
        setPdfBlob(receipt);
        setPdfModalOpen(true);

        notification.addNotification("Recibo gerado com sucesso!", "success");
        handleClose();
      },
      onError: () => {
        notification.addNotification("Erro ao gerar o recibo.", "error");
      },
    });
  };


  return (
    <>
      <Grid container spacing={2} marginBottom={2} alignItems="center">
        <Grid item xs={4}>
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={8} container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <GenerateEntryRelatory />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleOpen}>
              Gerar Recibo Personalizado
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.assign(addButtonPath)}
            >
              {addButtonName}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Gerar Recibo Personalizado</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={12}>
                <TextField
                  label="Pago a"
                  fullWidth
                  {...register("destinatario", { required: "Este campo é obrigatório" })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Valor"
                  type="number"
                  fullWidth
                  {...register("valor", {
                    required: "Este campo é obrigatório",
                    min: { value: 0.01, message: "O valor deve ser maior que zero" },
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={4}
                  {...register("descricao", { required: "Este campo é obrigatório" })}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            disabled={generateReceipt.isPending}
          >
            {generateReceipt.isPending ? (
              <CircularProgress size={20} sx={{ marginRight: "10px" }} />
            ) : null}
            Gerar Recibo
          </Button>
        </DialogActions>
      </Dialog>
      {pdfBlob && (
        <PdfViewerModal
          open={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          blob={pdfBlob}
          fileName="RECIBO-DE-LANCAMENTO-CUSTOMIZADO.pdf"
        />
      )}

    </>
  );
};

export default ExpensesTableHeaderComponent;
