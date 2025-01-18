import type { EntryPaginatedParams } from 'src/models/entry';

import React, { useRef, useEffect } from 'react';

import { Table, TableRow, TableCell, TableFooter, TablePagination } from '@mui/material';

interface TableFooterComponentProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setParams: React.Dispatch<React.SetStateAction<EntryPaginatedParams>>;
  totalItems: number;
  rowsPerPage: number;
  page: number;
}

const EntryTableFooterComponent: React.FC<TableFooterComponentProps> = ({
  setPage,
  setParams: changePage,
  totalItems,
  rowsPerPage,
  page,
}) => {
  const lastValidTotalItems = useRef<number>(0); // Fallback para totalItems

  // Atualiza lastValidTotalItems se totalItems for válido
  useEffect(() => {
    if (typeof totalItems === 'number' && !Number.isNaN(totalItems)) {
      lastValidTotalItems.current = totalItems;
    }
  }, [totalItems]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage); // Atualiza o estado da página atual
    changePage((prev) => ({
      ...prev,
      skip: newPage * rowsPerPage, // Calcula o skip baseado na nova página
      take: rowsPerPage, // Define o número de itens por página
    }));
  };

  const validCount =
    typeof totalItems === 'number' && !Number.isNaN(totalItems)
      ? totalItems
      : lastValidTotalItems.current;

  return (
    <Table>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>
            <TablePagination
              rowsPerPageOptions={[]} // Remove opções (fixo)
              count={validCount} // Usa o total válido
              rowsPerPage={rowsPerPage} // Número fixo de linhas por página
              page={page} // Página atual
              onPageChange={handleChangePage} // Função para troca de página
              component="div" // Para acessibilidade
              sx={{ width: '100%' }}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default EntryTableFooterComponent;
