import type { SubmitHandler } from "react-hook-form";
import type { EmployeePayload } from "src/models/employee";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useUpdateEmployee, useGetEmployeeById } from "src/hooks/useEmployee";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EmployeePayload>();
  const updateEmployee = useUpdateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const { data: employee, isLoading, isError, error } = useGetEmployeeById(employeeId);

  useEffect(() => {
    if (employee) {
      setValue("registroNumero", employee.registroNumero);
      setValue("nome", employee.nome);
      setValue("rg", employee.rg);
      setValue("cpf", employee.cpf);
      setValue("endereco", employee.endereco);
      setValue("contato", employee.contato);
      setValue("funcao", employee.funcao);
      setValue("salario", employee.salario);
      setValue("dataAdmissao", employee.dataAdmissao);
      setValue("dataDemissao", employee.dataDemissao || undefined);
      setValue("periodoFerias", employee.periodoFerias || undefined);
      setValue("dataDePagamento", employee.dataDePagamento || undefined);
      setValue("status", employee.status);
    }
  }, [employee, setValue]);

  const onSubmit: SubmitHandler<EmployeePayload> = (data) => {
    const updatedData: EmployeePayload = {
      ...data,
    };

    updateEmployee.mutate(
      { id: employeeId, data: updatedData },
      {
        onSuccess: () => {
          addNotification("Funcionário atualizado com sucesso!", "success");
          router.push("/employees");
        },
        onError: (err: any) => {
          addNotification(`Erro ao atualizar funcionário: ${err.message}`, "error");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (isError) {
    return (
      <DashboardContent>
        <Box sx={formStyle}>
          <Typography variant="h6" color="error">
            Erro ao carregar o funcionário: {error?.message}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Funcionário - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Funcionário
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Registro"
                    placeholder="Número de Registro"
                    {...register("registroNumero", { required: "O número de registro é obrigatório." })}
                    error={!!errors.registroNumero}
                    helperText={errors.registroNumero?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Nome do Funcionário"
                    {...register("nome", { required: "O nome é obrigatório." })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="RG"
                    placeholder="RG do Funcionário"
                    {...register("rg", { required: "O RG é obrigatório." })}
                    error={!!errors.rg}
                    helperText={errors.rg?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CPF"
                    placeholder="CPF do Funcionário"
                    {...register("cpf", { required: "O CPF é obrigatório." })}
                    error={!!errors.cpf}
                    helperText={errors.cpf?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Endereço do Funcionário"
                    {...register("endereco", { required: "O endereço é obrigatório." })}
                    error={!!errors.endereco}
                    helperText={errors.endereco?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contato"
                    placeholder="Telefone ou Email"
                    {...register("contato", { required: "O contato é obrigatório." })}
                    error={!!errors.contato}
                    helperText={errors.contato?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Função"
                    placeholder="Função do Funcionário"
                    {...register("funcao", { required: "A função é obrigatória." })}
                    error={!!errors.funcao}
                    helperText={errors.funcao?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Salário (R$)"
                    type="number"
                    {...register("salario", { required: "O salário é obrigatório.", min: 0 })}
                    error={!!errors.salario}
                    helperText={errors.salario?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Admissão"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataAdmissao", { required: "A data de admissão é obrigatória." })}
                    error={!!errors.dataAdmissao}
                    helperText={errors.dataAdmissao?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Demissão"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataDemissao")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Período de Férias"
                    placeholder="Período de Férias"
                    {...register("periodoFerias")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Pagamento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataDePagamento")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue=""
                      {...register("status", { required: "Selecione um status." })}
                    >
                      <MenuItem value="Empregado">Empregado</MenuItem>
                      <MenuItem value="Demitido">Demitido</MenuItem>
                      <MenuItem value="Férias">Férias</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={updateEmployee.isPending}
                  >
                    Atualizar
                    {updateEmployee.isPending && (
                      <CircularProgress size={20} sx={{ marginLeft: "20px" }} />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DashboardContent>
    </>
  );
}
