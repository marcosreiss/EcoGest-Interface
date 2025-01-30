import type { Employee } from 'src/models/employee';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeleteEmployee, useGetEmployeeByName, useGetEmployeesPaged } from 'src/hooks/useEmployee';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import TableSearch from 'src/components/table/tableSearch';
import { useNotification } from 'src/context/NotificationContext';
import TableFooterComponent from 'src/components/table/tableFooterComponent';
import TableHeaderComponent from 'src/components/table/tableHeaderComponent';

import EmployeeTableComponent from './components/employeeTableComponent';

// ----------------------------------------------------------------------

export default function EmployeePage() {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const rowsPerPage = 25;
  const [page, setPage] = useState(0);

  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useGetEmployeesPaged();

  const { data: searchResults, isLoading: isSearching } = useGetEmployeeByName(debouncedSearchString);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Limpa o timeout anterior para reiniciar o debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Se o valor tiver 3 ou mais caracteres, inicia o debounce
    if (inputValue.length >= 3) {
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchString(inputValue); // Atualiza o valor com debounce
      }, 500); // Atraso de 500ms antes de executar a busca
    } else {
      // Se o valor for menor que 3 caracteres, limpa a busca
      setDebouncedSearchString('');
    }
  };

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

  const employees = debouncedSearchString.length >= 3 ? searchResults : data?.data;
  
  return (
    <>
      <Helmet>
        <title>{`Funcionários - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <TableHeaderComponent
            title="Funcionários"
            addButtonName="Cadastrar Funcionário"
            addButtonPath="/employees/create"
          />
          <Grid item xs={12}>
            <TableSearch
              handleDelete={handleDeleteEmployee}
              handleSearchChange={handleSearchChange}
              isSearchDisabled={false}
              selectedRows={selectedEmployees}
            />
            <TableContainer component={Paper} sx={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <EmployeeTableComponent
                  setSelectedEmployees={setSelectedEmployees}
                  employees={employees || []}
                  isLoading={isLoading || isSearching}
                />
              </Box>

              <TableFooterComponent
                setPage={setPage}
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={data?.meta.totalItems}
              />
            </TableContainer>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
