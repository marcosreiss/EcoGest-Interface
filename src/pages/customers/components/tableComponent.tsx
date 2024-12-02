import React from "react";

import {
  Table,
  TableRow,
  Checkbox,
  TableHead,
  TableCell,
  TableBody,
  LinearProgress,
} from "@mui/material";

interface TableComponentProps<T> {
  tableName: string; // Nome da tabela
  data: T[]; // Dados genéricos (lista de objetos)
  isLoading: boolean; // Indica se está carregando
  fieldLabels: Record<string, string>;
}

const TableComponent = <T extends object>({ tableName, data, isLoading, fieldLabels }: TableComponentProps<T>) => {
  // Calcula os campos dinamicamente com base no primeiro objeto
  const fields = data.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : [];
  const columnsCount = fields.length;
  const columnsWidth = 95 / columnsCount;

  return (
    <Table stickyHeader aria-label={`${tableName} table`}>
      {/* Cabeçalho */}
      <TableHead>
        <TableRow>
          {/* Checkbox fixo */}
          <TableCell
            sx={{
              width: "5%", // Largura fixa para checkbox
              minWidth: "50px", // Evita colapsar
            }}
          >
            <Checkbox />
          </TableCell>
          {/* Geração dinâmica do cabeçalho */}
          {fields.map((field) => (
            <TableCell
              key={String(field)}
              sx={{
                width: `${columnsWidth}%`, // Divide igualmente
                minWidth: "150px",
              }}
            >
              {/* Usa o label ou o próprio nome do campo como fallback */}
              {fieldLabels[String(field)] || String(field)}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      {/* Corpo da Tabela */}
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columnsCount + 1} sx={{ padding: 0 }}>
              <LinearProgress sx={{ width: "100%" }} />
            </TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox />
              </TableCell>
              {fields.map((field) => (
                <TableCell key={String(field)}>
                  {String(row[field]) || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsCount + 1}>No data available</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
