import type { CustomerPayload } from "src/models/customers";

import { useState } from "react";
import InputMask from "react-input-mask";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Grid,
  Switch,
  Button,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateCustomer } from "src/hooks/useCustomer";

import { CONFIG } from "src/config-global";
import { PersonType } from "src/models/customers";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function Page() {
  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };
  const pessoaFisica = "Pessoa Física";
  const pessoaJuridica = "Pessoa Jurídica";
  const [personType, setPersonType] = useState(pessoaFisica);

  const togglePersonType = () => {
    if (personType === pessoaFisica) {
      setPersonType(pessoaJuridica);
    } else {
      setPersonType(pessoaFisica);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CustomerPayload>();

  const createCostumer = useCreateCustomer();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit = (data: CustomerPayload) => {
    if (personType === pessoaFisica) {
      data.cnpj = null;
      data.personType = PersonType.Individual;
    } else {
      data.cpf = null;
      data.personType = PersonType.Corporate;
    }
    createCostumer.mutate(data, {
      onSuccess: () => {
        addNotification("Cliente Cadastrado com sucesso!", "success");
        router.push("/customers");
      },
      onError: (error) => {
        addNotification(`Erro ao cadastrar cliente: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Cliente - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="h4"
                    sx={{ mb: { xs: 3, md: 5 } }}
                  >
                    Criar Cliente
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Maria José"
                    {...register("name", { required: true })}
                  />
                  {errors?.name && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.775rem",
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      Preencha o nome do cliente
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography component="span" fontSize={13.6} marginRight={2}>
                    {pessoaFisica}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch onClick={togglePersonType} defaultChecked={false} />
                    }
                    label={pessoaJuridica}
                  />
                </Grid>

                {/* Campo CPF com máscara */}
                {personType === pessoaFisica && (
                  <Grid item xs={12}>
                    <Controller
                      name="cpf"
                      control={control}
                      rules={{ required: personType === pessoaFisica }}
                      render={({ field }) => (
                        <InputMask
                          mask="999.999.999-99"
                          placeholder="xxx.xxx.xxx-xx"
                          maskChar=""
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={personType !== pessoaFisica}
                        >
                          {(inputProps) => (
                            <TextField
                              {...inputProps}
                              fullWidth
                              label={
                                personType === pessoaFisica ? "CPF" : "disabled"
                              }
                              error={!!errors.cpf}
                              helperText={
                                errors.cpf && "Preencha o cpf do cliente"
                              }
                            />
                          )}
                        </InputMask>
                      )}
                    />
                  </Grid>
                )}

                {/* Campo CNPJ com máscara */}
                {personType === pessoaJuridica && (
                  <Grid item xs={12}>
                    <Controller
                      name="cnpj"
                      control={control}
                      rules={{ required: personType === pessoaJuridica }}
                      render={({ field }) => (
                        <InputMask
                          mask="99.999.999/9999-99"
                          placeholder="xx.xxx.xxx/xxxx-xx"
                          maskChar=""
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={personType !== pessoaJuridica}
                        >
                          {(inputProps) => (
                            <TextField
                              {...inputProps}
                              fullWidth
                              label={
                                personType === pessoaJuridica
                                  ? "CNPJ"
                                  : "disabled"
                              }
                              error={!!errors.cnpj}
                              helperText={
                                errors.cnpj && "Preencha o cnpj do cliente"
                              }
                            />
                          )}
                        </InputMask>
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Rua dos Anzois, Quadra 4, Nº3"
                    {...register("address", { required: false })}
                  />
                </Grid>

                {/* Campo de Contato com máscara (já estava usando Controller) */}
                <Grid item xs={12}>
                  <Controller
                    name="contact"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <InputMask
                        mask="(99)99999-9999"
                        placeholder="(99)99999-9999"
                        maskChar=""
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label="Contato"
                            placeholder="(98)98923-4455"
                            error={!!errors.contact}
                            helperText={
                              errors.contact && "Preencha o contato do cliente"
                            }
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubmit(onSubmit)()}
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
