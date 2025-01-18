import type { Customer } from "src/models/customers";

import { useForm, Controller } from "react-hook-form"; // Import Controller
import InputMask from "react-input-mask";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import {
  Box,
  Grid,
  Switch,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  CircularProgress,
} from "@mui/material"; // Import InputMask

import { useRouter } from "src/routes/hooks";

import { useUpdateCustomer, useGetCustomerById } from "src/hooks/useCustomer";

import { CONFIG } from "src/config-global";
import { PersonType } from "src/models/customers";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const customerId = Number(id);

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

  // Incluímos 'control' para usar nos campos mascarados
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<Customer>();

  const updateCustomer = useUpdateCustomer();
  const router = useRouter();
  const { addNotification } = useNotification();

  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useGetCustomerById(customerId);

  useEffect(() => {
    if (customer) {
      setValue("name", customer.name);
      setValue("address", customer.address || "");
      setValue("contact", customer.contact || "");

      if (customer.personType === PersonType.Individual) {
        setPersonType(pessoaFisica);
        setValue("cpf", customer.cpf || "");
        setValue("cnpj", "");
      } else {
        setPersonType(pessoaJuridica);
        setValue("cnpj", customer.cnpj || "");
        setValue("cpf", "");
      }
    }
  }, [customer, setValue]);

  const onSubmit = (data: Customer) => {
    const updatedData: Customer = {
      ...data,
      personType:
        personType === pessoaFisica
          ? PersonType.Individual
          : PersonType.Corporate,
      cpf: personType === pessoaFisica ? data.cpf : null,
      cnpj: personType === pessoaJuridica ? data.cnpj : null,
    };

    updateCustomer.mutate(
      { id: customerId, data: updatedData },
      {
        onSuccess: () => {
          addNotification("Cliente atualizado com sucesso!", "success");
          router.push("/customers");
        },
        onError: (err) => {
          addNotification(`Erro ao atualizar cliente: ${err.message}`, "error");
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
            Erro ao carregar o cliente: {error?.message}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Cliente - ${CONFIG.appName}`}</title>
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
                    Editar Cliente
                  </Typography>
                </Grid>

                {/* NOME (sem máscara, uso normal de register) */}
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

                {/* SWITCH de Pessoa Física/Jurídica */}
                <Grid item xs={12}>
                  <Typography component="span" fontSize={13.6} marginRight={2}>
                    {pessoaFisica}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        onClick={togglePersonType}
                        checked={personType === pessoaJuridica}
                      />
                    }
                    label={pessoaJuridica}
                  />
                </Grid>

                {/* CPF (com máscara) */}
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
                        >
                          {(inputProps) => (
                            <TextField
                              {...inputProps}
                              fullWidth
                              label="CPF"
                              error={!!errors?.cpf}
                              helperText={
                                errors?.cpf && "Preencha o CPF do cliente"
                              }
                            />
                          )}
                        </InputMask>
                      )}
                    />
                  </Grid>
                )}

                {/* CNPJ (com máscara) */}
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
                        >
                          {(inputProps) => (
                            <TextField
                              {...inputProps}
                              fullWidth
                              label="CNPJ"
                              error={!!errors?.cnpj}
                              helperText={
                                errors?.cnpj && "Preencha o CNPJ do cliente"
                              }
                            />
                          )}
                        </InputMask>
                      )}
                    />
                  </Grid>
                )}

                {/* ENDEREÇO (sem máscara, uso normal) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Rua dos Anzois, Quadra 4, Nº3"
                    {...register("address")}
                  />
                </Grid>

                {/* CONTATO (com máscara) */}
                <Grid item xs={12}>
                  <Controller
                    name="contact"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <InputMask
                        mask="(99)99999-9999"
                        placeholder="(98)98923-4455"
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

                {/* BOTÃO DE ATUALIZAR */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={updateCustomer.isPending}
                  >
                    Atualizar
                    {updateCustomer.isPending && (
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
