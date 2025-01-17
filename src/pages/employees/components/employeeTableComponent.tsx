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

import { useDeleteEmployee } from "src/hooks/useEmployee";

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
  // const [advancePaymentModalOpen, setAdvancePaymentModalOpen] = useState(false);

  const navigate = useRouter();
  const deleteEmployee = useDeleteEmployee();
  const notification = useNotification();
  // const advancePayment = useAdvancePayment();

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
    deleteEmployee.mutate(employeeId, {
      onSuccess: () => {
        notification.addNotification("Funcionário deletada com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification(
          "Erro ao deletar funcionário, tente novamente mais tarde",
          "error"
        );
      },
    });
    setDeleteModalOpen(false);
  };

  // const handleAdvancePayment = (employeeId: number) => {
  //   const employee = employees.find((e) => e.employeeId === employeeId);
  //   if (!employee) return;

  //   advancePayment.mutate(employeeId, {
  //     onSuccess: () => {
  //       notification.addNotification(
  //         `Pagamento adiantado com sucesso para ${employee.nome}`,
  //         'success'
  //       );
  //     },
  //     onError: () => {
  //       notification.addNotification(
  //         `Erro ao adiantar pagamento para ${employee.nome}, tente novamente mais tarde`,
  //         'error'
  //       );
  //     },
  //   });
  //   setAdvancePaymentModalOpen(false);
  //   handleCloseMenu();
  // };

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
            <TableCell >Nome</TableCell>
            <TableCell >Função</TableCell>
            <TableCell >Contato</TableCell>
            <TableCell>Ações</TableCell>
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
                  {employee.contato}
                </TableCell>

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
              <TableCell colSpan={6} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg"
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhum Funcionário Cadastrado</p>
                </div>
              </TableCell>
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

      {/* <ConfirmationDialog
        open={advancePaymentModalOpen}
        confirmButtonText="Confirmar"
        description={`Tem certeza que deseja adiantar o pagamento de ${employees.find(e => e.employeeId === selectedItem)?.nome}?`}
        onClose={() => setAdvancePaymentModalOpen(false)}
        onConfirm={() => selectedItem && handleAdvancePayment(selectedItem)}
        title="Adiantar Pagamento"
      /> */}
    </>
  );
};

export default EmployeeTableComponent;
