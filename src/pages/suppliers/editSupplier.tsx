import type { Supplier } from "src/models/supplier";

import { useForm, Controller } from "react-hook-form"; // Importar Controller
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
} from "@mui/material";

import InputMask from "react-input-mask"; // Importar react-input-mask

import { useRouter } from "src/routes/hooks";
import { useUpdateSupplier, useGetSupplierById } from "src/hooks/useSupplier";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

export default function EditSupplierPage() {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);

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

  // useForm com Supplier
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control, // Para usar o Controller
  } = useForm<Supplier>();

  const updateSupplier = useUpdateSupplier();
  const router = useRouter();
  const { addNotification } = useNotification();

  const { data: supplier, isLoading, isError, error } = useGetSupplierById(supplierId);

  useEffect(() => {
    if (supplier) {
      setValue("name", supplier.name);
      setValue("address", supplier.address || "");
      setValue("contact", supplier.contact || "");
      
      if (supplier.cpf) {
        setPersonType(pessoaFisica);
        setValue("cpf", supplier.cpf);
        setValue("cnpj", "");
      } else if (supplier.cnpj) {
        setPersonType(pessoaJuridica);
        setValue("cnpj", supplier.cnpj);
        setValue("cpf", "");
      }
    }
  }, [supplier, setValue]);

  const onSubmit = (data: Supplier) => {
    const updatedData: Supplier = {
      ...data,
      // Se for pessoa física, cnpj fica null; se for jurídica, cpf fica null
      cpf: personType === pessoaFisica ? data.cpf : null,
      cnpj: personType === pessoaJuridica ? data.cnpj : null,
    };

    updateSupplier.mutate(
      { id: supplierId, data: updatedData },
      {
        onSuccess: () => {
          addNotification("Fornecedor atualizado com sucesso!", "success");
          router.push("/suppliers");
        },
        onError: (err: any) => {
          addNotification(`Erro ao atualizar fornecedor: ${err.message}`, "error");
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
            Erro ao carregar o fornecedor: {error?.message}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Fornecedor - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Fornecedor
                  </Typography>
                </Grid>

                {/* Nome */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    placeholder="Nome do Fornecedor"
                    {...register("name", {
                      required: "Preencha o nome do fornecedor.",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                {/* Switch Pessoa Física / Jurídica */}
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

                {/* CPF com máscara */}
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
                          maskChar=""
                          placeholder="xxx.xxx.xxx-xx"
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

                {/* CNPJ com máscara */}
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
                          maskChar=""
                          placeholder="xx.xxx.xxx/xxxx-xx"
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

                {/* Endereço */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    placeholder="Rua dos Anzois, Quadra 4, Nº3"
                    {...register("address")}
                  />
                </Grid>

                {/* Contato (telefone) com máscara */}
                <Grid item xs={12}>
                  <Controller
                    name="contact"
                    control={control}
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
                          />
                        )}
                      </InputMask>
                    )}
                  />
                </Grid>

                {/* Botão de atualizar */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleSubmit(onSubmit)()}
                    disabled={updateSupplier.isPending}
                  >
                    Atualizar
                    {updateSupplier.isPending && (
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
