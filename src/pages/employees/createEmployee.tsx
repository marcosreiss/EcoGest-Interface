import type { SubmitHandler } from "react-hook-form";
import type { EmployeePayload } from "src/models/employee";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import InputMask from "react-input-mask";

import { useRouter } from "src/routes/hooks";
import { useCreateEmployee } from "src/hooks/useEmployee";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function CreateEmployeePage() {
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
    formState: { errors },
    control, // Importante para máscaras
  } = useForm<EmployeePayload>();

  const createEmployee = useCreateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit: SubmitHandler<EmployeePayload> = (data) => {
    // Converte vírgula para ponto no salário
    const salarioStr = String(data.salario).replace(",", ".");
    const sanitizedData: EmployeePayload = {
      ...data,
      salario: parseFloat(salarioStr),
    };

    createEmployee.mutate(sanitizedData, {
      onSuccess: () => {
        addNotification("Funcionário cadastrado com sucesso!", "success");
        router.push("/employees");
      },
      onError: (error: any) => {
        addNotification(
          `Erro ao cadastrar funcionário: ${error.message}`,
          "error"
        );
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Funcionário - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Funcionário
                  </Typography>
                </Grid>

                {/* Nome */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Nome do Funcionário"
                    {...register("nome", {
                      required: "O nome do funcionário é obrigatório.",
                    })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
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

                {/* RG (com máscara) */}
                <Grid item xs={12}>
                  <Controller
                    name="rg"
                    control={control}
                    rules={{
                      required: "O RG é obrigatório.",
                    }}
                    render={({ field }) => (
                      <InputMask
                        mask="99.999.999-9" // Exemplo de máscara para RG
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

                {/* CPF (com máscara) */}
                <Grid item xs={12}>
                  <Controller
                    name="cpf"
                    control={control}
                    rules={{
                      required: "O CPF é obrigatório.",
                    }}
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

                {/* Contato (com máscara de telefone, se desejar) */}
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


                {/* Data de Admissão */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Admissão"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataAdmissao", {
                      required: "A data de admissão é obrigatória.",
                    })}
                    error={!!errors.dataAdmissao}
                    helperText={errors.dataAdmissao?.message}
                  />
                </Grid>

                {/* Data de Pagamento */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data de Pagamento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("dataDePagamento", {
                      required: "A data de pagamento é obrigatória.",
                    })}
                    error={!!errors.dataDePagamento}
                    helperText={errors.dataDePagamento?.message}
                  />
                </Grid>

                {/* Salário (texto, conversão no onSubmit) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Salário (R$)"
                    placeholder="Ex: 1500,00"
                    type="text" // para aceitar vírgulas
                    {...register("salario", {
                      required: "O salário é obrigatório.",
                    })}
                    error={!!errors.salario}
                    helperText={errors.salario?.message}
                  />
                </Grid>

                {/* Botão Enviar */}
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
