import type { SubmitHandler } from "react-hook-form";
import type { EmployeePayload } from "src/models/employee";

import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
} from "@mui/material";

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
  } = useForm<EmployeePayload>();

  const createEmployee = useCreateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit: SubmitHandler<EmployeePayload> = (data) => {
    // Converte vírgulas para pontos no salário
    const sanitizedData: EmployeePayload = {
      ...data,
      salario: parseFloat(data.salario.toString().replace(",", ".")),
    };

    createEmployee.mutate(sanitizedData, {
      onSuccess: () => {
        addNotification("Funcionário cadastrado com sucesso!", "success");
        router.push("/employees");
      },
      onError: (error: any) => {
        addNotification(`Erro ao cadastrar funcionário: ${error.message}`, "error");
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
                    {...register("rg", {
                      required: "O RG é obrigatório.",
                      maxLength: { value: 15, message: "RG deve ter no máximo 15 caracteres." },
                      pattern: {
                        value: /^[0-9.-]+$/, // Correção: remove o escape do hífen
                        message: "RG inválido. Use apenas números, pontos e traços.",
                      },
                    })}
                    error={!!errors.rg}
                    helperText={errors.rg?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CPF"
                    placeholder="CPF do Funcionário"
                    {...register("cpf", {
                      required: "O CPF é obrigatório.",
                      maxLength: { value: 14, message: "CPF deve ter no máximo 14 caracteres." },
                      pattern: {
                        value: /^[0-9.-]+$/, // Correção: remove o escape do hífen
                        message: "CPF inválido. Use apenas números, pontos e traços.",
                      },
                    })}
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
                      validate: (value) => {
                        // Converte o valor para string antes de aplicar o replace
                        const sanitizedValue = String(value).replace(",", ".");
                        return !Number.isNaN(parseFloat(sanitizedValue)) || "Insira um valor válido.";
                      },
                    })}
                    error={!!errors.salario}
                    helperText={errors.salario?.message}
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      defaultValue=""
                      {...register("status", { required: "Selecione um status." })}
                    >
                      <MenuItem value="Empregado">Empregado</MenuItem>
                      <MenuItem value="Demitido">Demitido</MenuItem>
                      <MenuItem value="Férias">Férias</MenuItem>
                    </Select>
                    {errors.status && (
                      <Typography variant="body2" color="error">
                        {errors.status.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid> */}


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
