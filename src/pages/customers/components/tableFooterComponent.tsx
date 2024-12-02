import React from 'react';

import { Table, TableRow, TableCell, TableFooter, TablePagination } from "@mui/material";

interface TableFooterComponentProps {
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    rowsPerPage: number;
    page: number;
}

const TableFooterComponent: React.FC<TableFooterComponentProps> = ({ setPage, totalItems, rowsPerPage, page }) => {

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    return (
        <Table>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>
                        <TablePagination
                            rowsPerPageOptions={[]} // Remove opções (fixo)
                            count={totalItems} // Total de registros
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
