import type { SubmitHandler } from "react-hook-form";
import type { EmployeePayload } from "src/models/employee";

import React from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import { Box, Grid, Button, Select, MenuItem, TextField, Typography, InputLabel, FormControl } from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateEmployee } from "src/hooks/useEmployee";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function CreateEmployeePage() {
  const formStyle = {
    mx: 'auto',
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: 'background.paper',
  };

  const { register, handleSubmit, formState: { errors } } = useForm<EmployeePayload>();
  const createEmployee = useCreateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit: SubmitHandler<EmployeePayload> = (data) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        addNotification("Funcionário cadastrado com sucesso!", "success");
        router.push("/employees");
      },
      onError: (error: any) => {
        addNotification(`Erro ao cadastrar funcionário: ${error.message}`, "error");
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Funcionário - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth='md'>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Funcionário
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Nome do Funcionário"
                    {...register("nome", { required: "O nome do funcionário é obrigatório." })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
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
                    placeholder="Salário do Funcionário"
                    type="number"
                    inputProps={{ min: 0, step: "0.01" }}
                    {...register("salario", { 
                      required: "O salário é obrigatório.",
                      min: { value: 0, message: "O salário não pode ser negativo." }
                    })}
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
                    onClick={handleSubmit(onSubmit)}
                  >
                    Enviar
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
