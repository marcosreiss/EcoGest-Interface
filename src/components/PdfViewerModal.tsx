import React, { useState, useEffect } from "react";

import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

interface PdfViewerModalProps {
    open: boolean;
    onClose: () => void;
    blob: Blob;
    fileName: string;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
    open,
    onClose,
    blob,
    fileName,
}) => {
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url); // cleanup
        }
        return undefined; // 👈 resolve o warning do ESLint
    }, [blob]);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = fileName;
        link.click();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Visualizar Documento</DialogTitle>
            <DialogContent dividers style={{ height: "80vh", padding: 0 }}>
                <iframe
                    src={pdfUrl}
                    title="Visualizador de PDF"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDownload} variant="outlined">
                    Baixar PDF
                </Button>
                <Button onClick={onClose} variant="contained" color="primary">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PdfViewerModal;
