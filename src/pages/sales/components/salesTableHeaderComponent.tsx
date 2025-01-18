import React, { useState } from "react";
import { useForm } from "react-hook-form";

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

import { useGenerateCustomSaleReceipt } from "src/hooks/useSales";

import { useNotification } from "src/context/NotificationContext";

interface HeaderComponentProps {
  title: string;
  addButtonName: string;
  addButtonPath: string;
}

interface CustomSaleReceiptInfo {
  destinatario: string;
  valor: number;
  descricao: string;
}

const SaleTableHeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  addButtonName,
  addButtonPath,
}) => {
  const { register, handleSubmit, reset } = useForm<CustomSaleReceiptInfo>();
  const [open, setOpen] = useState(false);
  const generateReceipt = useGenerateCustomSaleReceipt();
  const notification = useNotification();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: CustomSaleReceiptInfo) => {
    generateReceipt.mutate(data, {
      onSuccess: (receipt) => {
        const url = window.URL.createObjectURL(receipt);
        const link = document.createElement("a");
        link.href = url;
        link.download = `RECIBO-DE-VENDA-CUSTOMIZADO.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="flex-end" spacing={2}>
          
        <Grid item>
            <Button variant="contained" color="primary" onClick={handleOpen}>
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
            <Grid container spacing={2}>
              <Grid item xs={12} marginTop={1}>
                <TextField
                  label="Recebemos de"
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
    </>
  );
};

export default SaleTableHeaderComponent;
