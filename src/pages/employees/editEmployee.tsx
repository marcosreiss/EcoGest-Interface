import type { SubmitHandler } from "react-hook-form";
import type { EmployeePayload } from "src/models/employee";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; // <--- import Controller
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

import InputMask from "react-input-mask"; // <--- import InputMask

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control, // para usar máscaras
  } = useForm<EmployeePayload>();

  const updateEmployee = useUpdateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const { data, isLoading, isError, error } = useGetEmployeeById(employeeId);
  const employee = data?.data; // A API retorna algo como { data: EmployeePayload }

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
      setValue("dataDemissao", employee.dataDemissao ? new Date(employee.dataDemissao) : undefined);
      setValue("periodoFerias", employee.periodoFerias || undefined);
      setValue("dataDePagamento", employee.dataDePagamento ? new Date(employee.dataDePagamento) : undefined);
      setValue("status", employee.status);
    }
  }, [employee, setValue]);

  const onSubmit: SubmitHandler<EmployeePayload> = (formData) => {
    // Converte vírgula para ponto no salário
    const salarioStr = String(formData.salario || "").replace(",", ".");
    const updatedData: EmployeePayload = {
      ...formData,
      salario: parseFloat(salarioStr),
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

                {/* Registro */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Registro"
                    placeholder="Número de Registro"
                    {...register("registroNumero", {
                      required: "O número de registro é obrigatório.",
                    })}
                    error={!!errors.registroNumero}
                    helperText={errors.registroNumero?.message}
                  />
                </Grid>

                {/* Nome */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Nome do Funcionário"
                    {...register("nome", {
                      required: "O nome é obrigatório.",
                    })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                </Grid>

                {/* RG com máscara */}
                <Grid item xs={12}>
                  <Controller
                    name="rg"
                    control={control}
                    rules={{ required: "O RG é obrigatório." }}
                    render={({ field }) => (
                      <InputMask
                        mask="99.999.999-9" // Exemplo de formato RG
                        maskChar=""
                        placeholder="RG do Funcionário"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="RG"
                            error={!!errors.rg}
                            helperText={errors.rg?.message}
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                {/* CPF com máscara */}
                <Grid item xs={12}>
                  <Controller
                    name="cpf"
                    control={control}
                    rules={{ required: "O CPF é obrigatório." }}
                    render={({ field }) => (
                      <InputMask
                        mask="999.999.999-99"
                        maskChar=""
                        placeholder="CPF do Funcionário"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="CPF"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                {/* Endereço */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Endereço do Funcionário"
                    {...register("endereco", {
                      required: "O endereço é obrigatório.",
                    })}
                    error={!!errors.endereco}
                    helperText={errors.endereco?.message}
                  />
                </Grid>

                {/* Contato com máscara (telefone) */}
                <Grid item xs={12}>
                  <Controller
                    name="contato"
                    control={control}
                    rules={{ required: "O contato é obrigatório." }}
                    render={({ field }) => (
                      <InputMask
                        mask="(99)99999-9999"
                        maskChar=""
                        placeholder="(98)98923-4455"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="Contato"
                            error={!!errors.contato}
                            helperText={errors.contato?.message}
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                {/* Função */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Função"
                    placeholder="Função do Funcionário"
                    {...register("funcao", {
                      required: "A função é obrigatória.",
                    })}
                    error={!!errors.funcao}
                    helperText={errors.funcao?.message}
                  />
                </Grid>

                {/* Salário (aceita vírgula) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Salário (R$)"
                    placeholder="Ex.: 1500,00"
                    type="text" // para aceitar vírgulas
                    {...register("salario", {
                      required: "O salário é obrigatório.",
                      min: { value: 0, message: "Salário não pode ser negativo." },
                    })}
                    error={!!errors.salario}
                    helperText={errors.salario?.message}
                  />
                </Grid>

                {/* Data de Admissão */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Admissão"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataAdmissao")}
                    error={!!errors.dataAdmissao}
                    helperText={errors.dataAdmissao?.message}
                    // Mostra a data se houver
                    value={
                      employee?.dataAdmissao
                        ? new Date(employee.dataAdmissao).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </Grid>

                {/* Data de Demissão (descomente se quiser usar) */}
                {/* 
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Demissão"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataDemissao")}
                  />
                </Grid>
                */}

                {/* Período de Férias */}
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
                    error={!!errors.dataDePagamento}
                    helperText={errors.dataDePagamento?.message}
                    value={
                      employee?.dataDePagamento
                        ? new Date(employee.dataDePagamento).toISOString().split("T")[0]
                        : ""
                    }
                  />
                </Grid>


                {/* Status */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue={employee?.status || "Empregado"} // Valor inicial padrão
                      rules={{ required: "Selecione um status." }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="status-label"
                          id="status-select"
                          label="Status"
                          fullWidth
                        >
                          <MenuItem value="Empregado">Empregado</MenuItem>
                          <MenuItem value="Demitido">Demitido</MenuItem>
                          <MenuItem value="Férias">Férias</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <Typography variant="body2" color="error">
                        {errors.status.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>


                {/* Botão de Atualizar */}
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
