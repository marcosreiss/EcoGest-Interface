import type { Employee } from 'src/models/employee';

import * as React from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteEmployee, useGetEmployeesPaged } from 'src/hooks/useEmployee';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import TableSearch from 'src/layouts/components/tableSearch';
import { useNotification } from 'src/context/NotificationContext';
import TableFooterComponent from 'src/layouts/components/tableFooterComponent';
import TableHeaderComponent from 'src/layouts/components/tableHeaderComponent';

import EmployeeTableComponent from './components/employeeTableComponent';

// ----------------------------------------------------------------------

export default function EmployeePage() {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetEmployeesPaged(page * rowsPerPage, rowsPerPage);

  const totalItemsRef = React.useRef(0);

  // Define totalItems apenas na primeira chamada
  if (page === 0 && data?.meta?.totalItems && totalItemsRef.current === 0) {
    totalItemsRef.current = data.meta.totalItems;
  }
  const totalItems = totalItemsRef.current;

  const employees = data?.data || [];

  const deleteEmployee = useDeleteEmployee();
  const notification = useNotification();

  const handleDeleteEmployee = () => {
    selectedEmployees.forEach((employee) => {
      deleteEmployee.mutate(employee.employeeId, {
        onSuccess: () => {
          notification.addNotification('Funcionário deletado com sucesso', 'success');
          setSelectedEmployees([]);
        },
        onError: () => {
          notification.addNotification('Erro ao deletar funcionário, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Funcionários - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <TableHeaderComponent
            title="Funcionários"
            addButtonName="Cadastrar Funcionário"
            addButtonPath="/employees/create"
          />
          <Grid item xs={12}>
            <TableSearch
              handleDelete={handleDeleteEmployee}
              handleSearchChange={() => null}
              isSearchDisabled
              selectedRows={selectedEmployees}
            />
            <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <EmployeeTableComponent
                  setSelectedEmployees={setSelectedEmployees}
                  employees={employees}
                  isLoading={isLoading}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
