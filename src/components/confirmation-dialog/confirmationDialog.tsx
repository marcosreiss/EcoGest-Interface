import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

interface ConfirmationDialogProps {
  open: boolean; // Estado de visibilidade do modal
  onClose: () => void; // Função para fechar o modal
  onConfirm: () => void; // Função a ser executada ao confirmar (ex: deletar)
  title: string; // Título do modal
  description: string; // Descrição explicando a ação
  confirmButtonText: string; // Texto do botão de confirmação
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmButtonText,
}) => (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirmation-dialog-title">
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm(); 
            onClose();
          }}
          color="error"
          autoFocus
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );

export default ConfirmationDialog;
