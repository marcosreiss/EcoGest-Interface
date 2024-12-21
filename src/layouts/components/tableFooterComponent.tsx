import React, { useRef, useEffect } from 'react';

import { Table, TableRow, TableCell, TableFooter, TablePagination } from "@mui/material";

interface TableFooterComponentProps {
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    rowsPerPage: number;
    page: number;
}

const TableFooterComponent: React.FC<TableFooterComponentProps> = ({ setPage, totalItems, rowsPerPage, page }) => {
    const lastValidTotalItems = useRef<number>(0); // Inicializa com 0 como fallback padrão

    // Atualiza o valor de `lastValidTotalItems` sempre que `totalItems` for válido
    useEffect(() => {
        if (typeof totalItems === "number" && !Number.isNaN(totalItems)) {
            lastValidTotalItems.current = totalItems;
        }
    }, [totalItems]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Garante que `count` tenha um valor válido
    const validCount = typeof totalItems === "number" && !Number.isNaN(totalItems) ? totalItems : lastValidTotalItems.current;

    return (
        <Table>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>
                        <TablePagination 
                            rowsPerPageOptions={[]} // Remove opções (fixo)
                            count={validCount} // Usa sempre um valor válido
                            rowsPerPage={rowsPerPage} // Fixo
                            page={page} // Página atual
                            onPageChange={handleChangePage} // Corrigido para usar a função diretamente
                            component="div" // Para acessibilidade
                            sx={{ width: '100%' }}
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
};


export default TableFooterComponent;
