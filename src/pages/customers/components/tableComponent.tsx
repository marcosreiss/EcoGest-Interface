import React, { useState } from "react";

import {
  Menu,
  Table,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  LinearProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

interface TableComponentProps<T> {
  tableName: string; // Nome da tabela
  data: T[]; // Dados genéricos (lista de objetos)
  isLoading: boolean; // Indica se está carregando
  fieldLabels: Record<string, string>;
}

const TableComponent = <T extends { id: number }>({ tableName, data, isLoading, fieldLabels }: TableComponentProps<T>) => {
  // Calcula os campos dinamicamente com base no primeiro objeto
  const fields = data.length > 0 ? (Object.keys(data[0]) as (keyof T)[]) : [];
  const columnsCount = fields.length - 1;
  const columnsWidth = 95 / columnsCount;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useRouter();

  const handleClick = (event: any, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (id: number) => {
    navigate.push(`details/${id}`);
    handleClose();
  }

  return (
    <Table stickyHeader aria-label={`${tableName} table`}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{
              width: "5%",
              minWidth: "50px",
            }}
          >
            <Checkbox />
          </TableCell>

          {fields.map((field) => (
            field !== 'id' && (
              <TableCell
                key={String(field)}
                sx={{
                  width: `${columnsWidth}%`,
                  minWidth: "150px",
                }}
              >
                {fieldLabels[String(field)] || String(field)}
              </TableCell>
            )
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

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
                field !== 'id' && (
                  <TableCell key={String(field)}>
                    {String(row[field]) || "-"}
                  </TableCell>
                )))}
              <TableCell>
                <IconButton onClick={(event) => handleClick(event, index)} >
                  ︙
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl && selectedItem === index)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem onClick={() => handleDetailsClick(row.id)}>
                    Detalhes
                  </MenuItem>

                  <MenuItem>Editar</MenuItem>
                  <MenuItem>Deletar</MenuItem>
                </Menu>
              </TableCell>
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
