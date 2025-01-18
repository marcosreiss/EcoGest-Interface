import type { Person } from "src/models/person";

import InputMask from "react-input-mask";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Grid,
  Switch,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useUpdatePerson, useGetPersonById } from "src/hooks/usePerson";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function EditPerson() {
  const { id } = useParams<{ id: string }>();
  const personId = Number(id);

  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const [isCnpj, setIsCnpj] = useState(false);

  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<Person>();

  const toggleCpfCnpj = () => {
    setIsCnpj(!isCnpj);
    setValue("cpfCnpj", "");
  };

  const updatePerson = useUpdatePerson();
  const router = useRouter();
  const { addNotification } = useNotification();

  const {
    data: person,
    isLoading,
    isError,
    error,
  } = useGetPersonById(personId);

  useEffect(() => {
    if (person) {
      setValue("name", person.name);
      setValue("type", person.type);
      setValue("cpfCnpj", person.cpfCnpj);
      setValue("contact", person.contact);
      setValue("email", person.email);
      setValue("obs", person.obs);

      if (person.address) {
        setValue("address.cep", person.address.cep);
        setValue("address.cidade", person.address.cidade);
        setValue("address.uf", person.address.uf);
        setValue("address.bairro", person.address.bairro);
        setValue("address.endereco", person.address.endereco);
        setValue("address.numero", person.address.numero);
        setValue("address.complemento", person.address.complemento);
      }

      setIsCnpj(person.cpfCnpj.length > 14); // Determina a máscara com base no comprimento do CPF/CNPJ
    }
  }, [person, setValue]);

  const onSubmit = (data: Person) => {
    const updatedData: Person = {
      ...data,
      cpfCnpj: isCnpj ? data.cpfCnpj : data.cpfCnpj,
    };

    updatePerson.mutate(
      { id: personId, data: updatedData },
      {
        onSuccess: () => {
          addNotification("Pessoa atualizada com sucesso!", "success");
          router.push("/person");
        },
        onError: (err) => {
          addNotification(`Erro ao atualizar pessoa: ${err.message}`, "error");
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
            Erro ao carregar a pessoa: {error?.message}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Pessoa - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Pessoa
                  </Typography>
                </Grid>

                {/* Nome */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Maria José"
                    {...register("name", { required: "Preencha o nome da pessoa" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                {/* Toggle CPF/CNPJ */}
                <Grid item xs={12}>
                  <Typography component="span" fontSize={13.6} marginRight={2}>
                    CPF
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isCnpj}
                        onChange={toggleCpfCnpj}
                        color="primary"
                      />
                    }
                    label="CNPJ"
                  />
                </Grid>

                {/* CPF ou CNPJ */}
                <Grid item xs={12}>
                  <Controller
                    name="cpfCnpj"
                    control={control}
                    rules={{
                      required: "Preencha o CPF ou CNPJ",
                      pattern: {
                        value: isCnpj
                          ? /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
                          : /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                        message: "Formato inválido",
                      },
                    }}
                    render={({ field }) => (
                      <InputMask
                        mask={isCnpj ? "99.999.999/9999-99" : "999.999.999-99"}
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label={isCnpj ? "CNPJ" : "CPF"}
                            error={!!errors.cpfCnpj}
                            helperText={errors.cpfCnpj?.message}
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                {/* Contato */}
                <Grid item xs={12}>
                  <Controller
                    name="contact"
                    control={control}
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
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    placeholder="email@exemplo.com"
                    {...register("email")}
                  />
                </Grid>

                {/* Observação */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observação"
                    placeholder="Informações adicionais"
                    multiline
                    rows={3}
                    {...register("obs")}
                  />
                </Grid>

                {/* Campos de Endereço */}
                <Grid item xs={12}>
                  <Typography variant="h6">Endereço</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    {...register("address.cep")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    {...register("address.cidade")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    {...register("address.bairro")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="UF"
                    {...register("address.uf")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    {...register("address.endereco")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Número"
                    {...register("address.numero")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    {...register("address.complemento")}
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
