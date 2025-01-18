import type { Person } from "src/models/person";

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

import { useDeletePerson } from "src/hooks/usePerson";

import { useNotification } from "src/context/NotificationContext";

import ConfirmationDialog from "src/components/confirmation-dialog/confirmationDialog";

interface TableComponentProps {
  persons: Person[];
  isLoading: boolean;
  isSearching: boolean;
  setSelectedPersons: React.Dispatch<React.SetStateAction<Person[]>>;
}

const PersonTableComponent: React.FC<TableComponentProps> = ({
  persons,
  isLoading,
  isSearching,
  setSelectedPersons,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);

  const navigate = useRouter();
  const deletePerson = useDeletePerson();
  const notification = useNotification();

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    personId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(personId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDetailsClick = (personId: number) => {
    navigate.push(`details/${personId}`);
    handleClose();
  };

  const handleEditClick = (personId: number) => {
    navigate.push(`edit/${personId}`);
    handleClose();
  };

  const handleDeletePerson = (personId: number) => {
    handleClose();
    deletePerson.mutate(personId, {
      onSuccess: () => {
        notification.addNotification("Pessoa deletada com sucesso", "success");
        setDeleteModalOpen(false);
      },
      onError: () => {
        notification.addNotification(
          "Erro ao deletar pessoa, tente novamente mais tarde",
          "error"
        );
      },
    });
  };

  const handleDeleteClick = (personId: number) => {
    setDeleteModalOpen(true);
    setSelectedItem(personId);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = persons.map((p) => p.personId);
      setSelectedPersonIds(allIds);
      setSelectedPersons(persons);
    } else {
      setSelectedPersonIds([]);
      setSelectedPersons([]);
    }
  };

  const handleSelectPerson = (
    event: React.ChangeEvent<HTMLInputElement>,
    person: Person
  ) => {
    if (event.target.checked) {
      setSelectedPersonIds((prev) => [...prev, person.personId]);
      setSelectedPersons((prev) => [...prev, person]);
    } else {
      setSelectedPersonIds((prev) =>
        prev.filter((id) => id !== person.personId)
      );
      setSelectedPersons((prev) =>
        prev.filter((p) => p.personId !== person.personId)
      );
    }
  };

  return (
    <>
      <Table stickyHeader aria-label="persons table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "5%", minWidth: "50px" }}>
              <Checkbox
                checked={
                  persons.length > 0 &&
                  selectedPersonIds.length === persons.length
                }
                indeterminate={
                  selectedPersonIds.length > 0 &&
                  selectedPersonIds.length < persons.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell sx={{ width: "25%", minWidth: "150px" }}>Nome</TableCell>
            <TableCell sx={{ width: "25%", minWidth: "150px" }}>Tipo</TableCell>
            <TableCell sx={{ width: "30%", minWidth: "150px" }}>CPF/CNPJ</TableCell>
            <TableCell sx={{ width: "15%", minWidth: "150px" }}>Contato</TableCell>
            <TableCell sx={{ width: "5%" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading || isSearching ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ padding: 0 }}>
                <LinearProgress sx={{ width: "100%" }} />
              </TableCell>
            </TableRow>
          ) : persons.length > 0 ? (
            persons.map((person) => (
              <TableRow key={person.personId}>
                <TableCell>
                  <Checkbox
                    checked={selectedPersonIds.includes(person.personId)}
                    onChange={(e) => handleSelectPerson(e, person)}
                  />
                </TableCell>
                <TableCell>{person.name || "-"}</TableCell>
                <TableCell>{person.type || "-"}</TableCell>
                <TableCell>{person.cpfCnpj || "-"}</TableCell>
                <TableCell>{person.contact || "-"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleClick(event, person.personId)}
                  >
                    ︙
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(
                      anchorEl && selectedItem === person.personId
                    )}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => handleDetailsClick(person.personId)}
                    >
                      Detalhes
                    </MenuItem>
                    <MenuItem onClick={() => handleEditClick(person.personId)}>
                      Editar
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteClick(person.personId)}
                    >
                      Deletar
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <img
                    src="/assets/icons/ic-content.svg"
                    alt="Sem dados"
                    style={{ maxWidth: "150px", marginBottom: "10px" }}
                  />
                  <p>Nenhuma Pessoa Cadastrada</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={deleteModalOpen}
        confirmButtonText="Deletar"
        description="Tem certeza que você quer deletar esta pessoa?"
        onClose={() => {
          setDeleteModalOpen(false);
          handleClose();
        }}
        onConfirm={() => selectedItem && handleDeletePerson(selectedItem)}
        title="Deletar Pessoa"
      />
    </>
  );
};

export default PersonTableComponent;
