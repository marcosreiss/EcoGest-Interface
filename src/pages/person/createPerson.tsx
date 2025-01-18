import type { PersonPayload } from "src/models/person";

import { useState } from "react";
import InputMask from "react-input-mask";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Grid,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreatePerson } from "src/hooks/usePerson";

import { CONFIG } from "src/config-global";
import { PersonType } from "src/models/person";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function CreatePerson() {
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
    formState: { errors },
    control,
    setValue
  } = useForm<PersonPayload>();

  const toggleCpfCnpj = () => {
    setIsCnpj(!isCnpj);
    setValue("cpfCnpj", "");
  };

  const createPerson = useCreatePerson();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit = (data: PersonPayload) => {
    console.log(data);
    
    createPerson.mutate(data, {
      onSuccess: () => {
        addNotification("Pessoa cadastrada com sucesso!", "success");
        router.push("/person");
      },
      onError: (error) => {
        addNotification(`Erro ao cadastrar pessoa: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Pessoa - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Pessoa
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

                {/* Tipo */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo"
                    defaultValue=""
                    {...register("type", { required: "Selecione o tipo da pessoa" })}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    <MenuItem value={PersonType.cliente}>Cliente</MenuItem>
                    <MenuItem value={PersonType.fornecedor}>Fornecedor</MenuItem>
                  </TextField>
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
                            placeholder="(99) 99999-9999"
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
                    type="email"
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
                    placeholder="00000-000"
                    {...register("cep")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    placeholder="São Paulo"
                    {...register("cidade")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    placeholder="Centro"
                    {...register("bairro")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="UF"
                    placeholder="SP"
                    {...register("uf")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Rua dos Anzois"
                    {...register("endereco")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Número"
                    placeholder="123"
                    {...register("numero")}
                  />
                </Grid>
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
