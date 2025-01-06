import type { CreateSupplierPayload } from "src/models/supplier";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form"; // Importar Controller
import { Helmet } from "react-helmet-async";

import {
  Box,
  Grid,
  Switch,
  Button,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import InputMask from "react-input-mask"; // Importar react-input-mask

import { useRouter } from "src/routes/hooks";
import { useCreateSupplier } from "src/hooks/useSupplier";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// ----------------------------------------------------------------------

export default function CreateSupplierPage() {
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
    setPersonType((prev) =>
      prev === pessoaFisica ? pessoaJuridica : pessoaFisica
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control, // para usar com Controller
  } = useForm<CreateSupplierPayload>();

  const createSupplier = useCreateSupplier();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit = (data: CreateSupplierPayload) => {
    if (personType === pessoaFisica) {
      data.cnpj = null;
      data.personType = "individual";
    } else {
      data.cpf = null;
      data.personType = "corporate";
    }

    createSupplier.mutate(data, {
      onSuccess: () => {
        addNotification("Fornecedor cadastrado com sucesso!", "success");
        router.push("/suppliers");
      },
      onError: (error: any) => {
        addNotification(
          `Erro ao cadastrar fornecedor: ${error.message}`,
          "error"
        );
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Fornecedor - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Fornecedor
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Nome do Fornecedor"
                    {...register("name", {
                      required: "O nome do fornecedor é obrigatório.",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                {/* Switch para pessoa física / jurídica */}
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
                      rules={{
                        required: "Preencha o CPF do fornecedor.",
                      }}
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
                              error={!!errors.cpf}
                              helperText={errors.cpf?.message}
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
                      rules={{
                        required: "Preencha o CNPJ do fornecedor.",
                      }}
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
                              error={!!errors.cnpj}
                              helperText={errors.cnpj?.message}
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
                    {...register("address")}
                  />
                </Grid>

                {/* CONTATO (telefone) com máscara */}
                <Grid item xs={12}>
                  <Controller
                    name="contact"
                    control={control}
                    // Se quiser torná-lo obrigatório, defina a regra aqui.
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
                    onClick={handleSubmit(onSubmit)}
                    disabled={createSupplier.isPending}
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
