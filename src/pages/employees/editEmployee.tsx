import type { EmployeePayload } from "src/models/employee";

import { useEffect } from "react";
import InputMask from "react-input-mask";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useUpdateEmployee, useGetEmployeeById } from "src/hooks/useEmployee";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function EditEmployee() {
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
    control,
  } = useForm<EmployeePayload>();

  const updateEmployee = useUpdateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetEmployeeById(employeeId);
  const employee = data?.data;

  useEffect(() => {
    if (employee) {
      setValue("registroNumero", employee.registroNumero);
      setValue("nome", employee.nome);
      setValue("rg", employee.rg);
      setValue("cpf", employee.cpf);
      setValue("contato", employee.contato);
      setValue("funcao", employee.funcao);
      setValue("salario", employee.salario);
      setValue("dataAdmissao", employee.dataAdmissao);
      setValue("dataDemissao", employee.dataDemissao);
      setValue("periodoFerias", employee.periodoFerias);

      setValue("cep", employee.address.cep);
      setValue("cidade", employee.address.cidade);
      setValue("uf", employee.address.uf);
      setValue("bairro", employee.address.bairro);
      setValue("endereco", employee.address.endereco);
      setValue("numero", employee.address.numero);
      setValue("complemento", employee.address.complemento);
    }
  }, [employee, setValue]);

  const onSubmit = (payload: EmployeePayload) => {
    updateEmployee.mutate(
      { id: employeeId, data: payload },
      {
        onSuccess: () => {
          addNotification("Funcionário atualizado com sucesso!", "success");
          router.push("/employees");
        },
        onError: (err) => {
          addNotification(`Erro ao atualizar funcionário: ${err.message}`, "error");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
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

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Funcionário
                  </Typography>
                </Grid>

                {/* Registro Número */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Registro Número"
                    {...register("registroNumero", { required: "Preencha o registro número" })}
                    error={!!errors.registroNumero}
                    helperText={errors.registroNumero?.message}
                  />
                </Grid>

                {/* Nome */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    {...register("nome", { required: "Preencha o nome do funcionário" })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                </Grid>

                {/* RG */}
                <Grid item xs={6}>
                  <Controller
                    name="rg"
                    control={control}
                    rules={{
                      required: "Preencha o RG",
                      pattern: {
                        value: /^\d{2}\.\d{3}\.\d{3}-\d{1}$/,
                        message: "Formato inválido",
                      },
                    }}
                    render={({ field }) => (
                      <InputMask
                        mask="99.999.999-9"
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

                {/* CPF */}
                <Grid item xs={6}>
                  <Controller
                    name="cpf"
                    control={control}
                    rules={{
                      required: "Preencha o CPF",
                      pattern: {
                        value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                        message: "Formato inválido",
                      },
                    }}
                    render={({ field }) => (
                      <InputMask
                        mask="999.999.999-99"
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

                {/* Contato */}
                <Grid item xs={6}>
                  <Controller
                    name="contato"
                    control={control}
                    rules={{ required: "Preencha o contato" }}
                    render={({ field }) => (
                      <InputMask
                        mask="(99) 99999-9999"
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Função"
                    {...register("funcao", { required: "Preencha a função" })}
                    error={!!errors.funcao}
                    helperText={errors.funcao?.message}
                  />
                </Grid>

                {/* Salário */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Salário"
                    type="number"
                    {...register("salario", { required: "Preencha o salário", valueAsNumber: true })}
                    error={!!errors.salario}
                    helperText={errors.salario?.message}
                  />
                </Grid>

                {/* Data de Admissão */}
                <Grid item xs={6}>
                  <Controller
                    name="dataAdmissao"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        fullWidth
                        label="Data de Admissão"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.dataAdmissao}
                        helperText={errors.dataAdmissao?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Data de Demissão */}
                <Grid item xs={6}>
                  <Controller
                    name="dataDemissao"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        fullWidth
                        label="Data de Demissão"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.dataDemissao}
                        helperText={errors.dataDemissao?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Período de Férias */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Período de Férias"
                    {...register("periodoFerias")}
                  />
                </Grid>

                {/* Endereço */}
                <Grid item xs={12}>
                  <Typography variant="h6">Endereço</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    {...register("cep")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    {...register("cidade")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    {...register("bairro")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="UF"
                    {...register("uf")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    {...register("endereco")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Número"
                    type="number"
                    {...register("numero")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    {...register("complemento")}
                  />
                </Grid>

                {/* Botão de Atualizar */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                  >
                    Atualizar
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
