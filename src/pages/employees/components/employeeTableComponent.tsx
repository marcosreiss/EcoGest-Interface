import type { Employee } from "src/models/employee";

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

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface EmployeeTableComponentProps {
  employees: Employee[];
  isLoading: boolean;
  setSelectedEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const EmployeeTableComponent: React.FC<EmployeeTableComponentProps> = ({
  employees,
  isLoading,
  setSelectedEmployees,
}) => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useRouter();
  const notification = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLElement>, employeeId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(employeeId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (employeeId: number) => {
    navigate.push(`details/${employeeId}`);
    handleCloseMenu();
  };

  const handleEditClick = (employeeId: number) => {
    navigate.push(`edit/${employeeId}`);
    handleCloseMenu();
  };

  const handleDeleteClick = (employeeId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(employeeId);
  };

  const handleDeleteEmployee = (employeeId: number) => {
    handleCloseMenu();
    // Aqui você pode adicionar o hook para deletar o funcionário
    notification.addNotification('Funcionário deletado com sucesso', 'success');
    setDeleteModalOpen(false);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = employees.map((e) => e.employeeId);
      setSelectedEmployeeIds(allIds);
      setSelectedEmployees(employees);
    } else {
      setSelectedEmployeeIds([]);
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (event: React.ChangeEvent<HTMLInputElement>, employee: Employee) => {
    if (event.target.checked) {
      setSelectedEmployeeIds((prev) => [...prev, employee.employeeId]);
      setSelectedEmployees((prev) => [...prev, employee]);
    } else {
      setSelectedEmployeeIds((prev) => prev.filter((id) => id !== employee.employeeId));
      setSelectedEmployees((prev) => prev.filter((e) => e.employeeId !== employee.employeeId));
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="employees table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={employees.length > 0 && selectedEmployeeIds.length === employees.length}
                indeterminate={selectedEmployeeIds.length > 0 && selectedEmployeeIds.length < employees.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ width: "40%", minWidth: "150px" }}>Nome</TableCell>
            <TableCell sx={{ width: "25%", minWidth: "100px" }}>Função</TableCell>
            <TableCell sx={{ width: "20%", minWidth: "100px" }}>Salário</TableCell>
            <TableCell sx={{ width: "10%", minWidth: "100px" }}>Status</TableCell>
            <TableCell sx={{ width: "5%" }}> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.employeeId}>
                <TableCell>
                  <Checkbox
                    checked={selectedEmployeeIds.includes(employee.employeeId)}
                    onChange={(e) => handleSelectEmployee(e, employee)}
                  />
                </TableCell>
                <TableCell>{employee.nome || "-"}</TableCell>
                <TableCell>{employee.funcao || "-"}</TableCell>
                <TableCell>
                  {employee.salario !== undefined ? `R$${employee.salario.toFixed(2)}` : "-"}
                </TableCell>
                <TableCell>{employee.status || "-"}</TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleClick(event, employee.employeeId)}>︙</IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedItem === employee.employeeId)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => handleDetailsClick(employee.employeeId)}>
                      Detalhes
                    </MenuItem>
                    <MenuItem onClick={() => handleEditClick(employee.employeeId)}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteClick(employee.employeeId)}>
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>Nenhum dado disponível</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que deseja deletar o funcionário?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleCloseMenu();
        }}
        onConfirm={() => selectedItem && handleDeleteEmployee(selectedItem)}
        title="Deletar Funcionário"
      />
    </>
  );
};

export default EmployeeTableComponent;