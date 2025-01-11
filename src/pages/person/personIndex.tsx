import type { Person } from 'src/models/person';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import { Box, Grid } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';

import { useDeletePerson, useGetPersonByName, useGetPersonsPaged } from 'src/hooks/usePerson';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotification } from 'src/context/NotificationContext';

import TableSearch from '../../layouts/components/tableSearch';
import TableComponent from './components/personTableComponent';
import TableHeaderComponent from '../../layouts/components/tableHeaderComponent';
import TableFooterComponent from '../../layouts/components/tableFooterComponent';

// ----------------------------------------------------------------------

export default function PersonsIndex() {
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);

  const rowsPerPage = 5;
  const [page, setPage] = useState(0);

  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useGetPersonsPaged(page * rowsPerPage, rowsPerPage);

  const { data: searchResults, isLoading: isSearching } = useGetPersonByName(debouncedSearchString);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (inputValue.length >= 3) {
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchString(inputValue);
      }, 500);
    } else {
      setDebouncedSearchString('');
    }
  };

  const deletePerson = useDeletePerson();
  const notification = useNotification();

  const handleDeletePerson = () => {
    selectedPersons.forEach((person) => {
      deletePerson.mutate(person.personId, {
        onSuccess: () => {
          notification.addNotification('Pessoa deletada com sucesso', 'success');
          setSelectedPersons([]);
        },
        onError: () => {
          notification.addNotification('Erro ao deletar pessoa, tente novamente mais tarde', 'error');
        },
      });
    });
  };

  const persons = (debouncedSearchString.length >= 3 ? searchResults : data?.data) ?? [];

  return (
    <>
      <Helmet>
        <title>{`Pessoas - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          {/* Cabeçalho com título e botão de adicionar */}
          <TableHeaderComponent
            title="Pessoas"
            addButtonName="Cadastrar Pessoa"
            addButtonPath="/persons/create"
          />

          <Grid item xs={12}>
            {/* Barra de busca e botão de deletar selecionados */}
            <TableSearch
              handleDelete={handleDeletePerson}
              selectedRows={selectedPersons}
              handleSearchChange={handleSearchChange}
              isSearchDisabled={false}
            />

            <TableContainer
              component={Paper}
              sx={{
                height: '65vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Área de exibição dos itens da tabela */}
              <Box component="div" sx={{ flex: 1, overflow: 'auto' }}>
                <TableComponent
                  setSelectedPersons={setSelectedPersons}
                  isSearching={isSearching}
                  persons={persons}
                  isLoading={isLoading}
                />
              </Box>

              {/* Rodapé com paginação */}
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
