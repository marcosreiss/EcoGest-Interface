import React, { useState, useEffect } from "react";

import {
    Radio,
    Dialog,
    Button,
    TextField,
    FormLabel,
    RadioGroup,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
    FormControlLabel,
} from "@mui/material";

interface UpdateReceiveStatusModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: { status: 'Pago' | 'Parcial'; payedValue?: number; date?: string }) => void;
    totalValue: number;
    defaultValues?: {
        status?: 'Pago' | 'Parcial',
        payedValue?: number,
        date?: string;
    };
}

const UpdateReceiveStatusModal: React.FC<UpdateReceiveStatusModalProps> = ({
    open,
    onClose,
    onConfirm,
    totalValue,
    defaultValues,
}) => {



    const [status, setStatus] = useState<'Pago' | 'Parcial'>('Pago');
    const [payedValue, setPayedValue] = useState<number>();
    const [date, setDate] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (open) {
            setStatus(defaultValues?.status ?? 'Pago');
            setPayedValue(defaultValues?.payedValue);
            setDate(defaultValues?.date ?? new Date().toISOString().split('T')[0]);
            setError('');
        }
    }, [open, defaultValues]);

    useEffect(() => {
        if (!open) {
            setStatus('Pago');
            setPayedValue(undefined);
            setDate('');
            setError('');
        }
    }, [open]);


    const handleConfirm = () => {
        if (status === 'Parcial') {
            if (payedValue === undefined || payedValue <= 0) {
                setError("Informe um valor válido.");
                return;
            }
            if (payedValue >= totalValue) {
                setError("Valor parcial não pode ser igual ou maior que o valor total.");
                return;
            }
        }
        const payload = {
            status,
            payedValue: status === 'Pago' ? totalValue : payedValue,
            date,
        }
        onConfirm(payload);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Atualizar Status de Pagamento</DialogTitle>
            <DialogContent dividers>
                <FormControl component="fieldset" fullWidth margin="normal">
                    <FormLabel component="legend">Tipo de Baixa</FormLabel>
                    <RadioGroup
                        row
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value as 'Pago' | 'Parcial');
                            setError('');
                        }}
                    >
                        <FormControlLabel value="Pago" control={<Radio />} label="Total" />
                        <FormControlLabel value="Parcial" control={<Radio />} label="Parcial" />
                    </RadioGroup>
                </FormControl>

                {status === 'Parcial' && (
                    <TextField
                        label="Valor Pago"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={payedValue ?? ''}
                        onChange={(e) => {
                            setPayedValue(Number(e.target.value));
                            setError('');
                        }}
                        error={!!error}
                        helperText={error}
                    />
                )}

                <TextField
                    label="Data do Pagamento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleConfirm} variant="contained" color="primary">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateReceiveStatusModal;
