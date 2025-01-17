import type { EmployeePayload } from "src/models/employee";

import InputMask from "react-input-mask";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";

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

export default function CreateEmployee() {
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
    control,
  } = useForm<EmployeePayload>();

  const createEmployee = useCreateEmployee();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit = (data: EmployeePayload) => {
    console.log(data);

    createEmployee.mutate(data, {
      onSuccess: () => {
        addNotification("Funcionário cadastrado com sucesso!", "success");
        router.push("/employees");
      },
      onError: (error) => {
        addNotification(`Erro ao cadastrar funcionário: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Funcionário - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
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
                    placeholder="Maria José"
                    {...register("nome", { required: "Preencha o nome do funcionário" })}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                  />
                </Grid>

                {/* Registro Número */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Registro Número"
                    placeholder="123456"
                    {...register("registroNumero", { required: "Preencha o registro número" })}
                    error={!!errors.registroNumero}
                    helperText={errors.registroNumero?.message}
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
                            placeholder="12.345.678-9"
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
                            placeholder="123.456.789-10"
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
                            placeholder="(99) 99999-9999"
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
                    placeholder="Desenvolvedor"
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
                    placeholder="3000"
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
                    rules={{ required: "Preencha a data de admissão" }}
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
                {/* <Grid item xs={6}>
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
                </Grid> */}

                {/* Período de Férias */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Período de Férias"
                    placeholder="Janeiro"
                    {...register("periodoFerias")}
                  />
                </Grid>

                {/* Campos de Endereço */}
                <Grid item xs={12}>
                  <Typography variant="h6">Endereço</Typography>
                </Grid>
                {/* CEP */}
                <Grid item xs={6}>
                  <Controller
                    name="cep"
                    control={control}
                    render={({ field }) => (
                      <InputMask
                        mask="99999-999"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="CEP"
                            placeholder="00000-000"
                            error={!!errors.cep}
                            helperText={errors.cep?.message}
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>
                {/* Cidade */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    placeholder="São Paulo"
                    {...register("cidade")}
                    error={!!errors.cidade}
                    helperText={errors.cidade?.message}
                  />
                </Grid>
                {/* Bairro */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    placeholder="Centro"
                    {...register("bairro")}
                    error={!!errors.bairro}
                    helperText={errors.bairro?.message}
                  />
                </Grid>

                {/* UF */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="UF"
                    placeholder="SP"
                    {...register("uf")}
                    error={!!errors.uf}
                    helperText={errors.uf?.message}
                  />
                </Grid>

                {/* Endereço */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Rua dos Anzois"
                    {...register("endereco")}
                    error={!!errors.endereco}
                    helperText={errors.endereco?.message}
                  />
                </Grid>

                {/* Número */}
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Número"
                    type="number"
                    placeholder="123"
                    {...register("numero", { valueAsNumber: true })}
                    error={!!errors.numero}
                    helperText={errors.numero?.message}
                  />
                </Grid>

                {/* Complemento */}
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    placeholder="Apto 1"
                    {...register("complemento")}
                  />
                </Grid>

                {/* Botão de Envio */}
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
