import type { Customer } from "src/models/customers";

import { useForm } from "react-hook-form";
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
    mx: 'auto',
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: 'background.paper',
  };
  
  const pessoaFisica = 'Pessoa Física';
  const pessoaJuridica = 'Pessoa Jurídica';
  const [personType, setPersonType] = useState(pessoaFisica);
  
  const togglePersonType = () => {
    if (personType === pessoaFisica) {
      setPersonType(pessoaJuridica);
    } else {
      setPersonType(pessoaFisica);
    }
  };
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Customer>();
  const updateCustomer = useUpdateCustomer();
  const router = useRouter();
  const { addNotification } = useNotification();
  
  const { data: customer, isLoading, isError, error } = useGetCustomerById(customerId);
  
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
      personType: personType === pessoaFisica ? PersonType.Individual : PersonType.Corporate,
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
  
      <DashboardContent maxWidth='md'>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Cliente
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
                        mt: 1
                      }}
                    >
                      Preencha o nome do cliente
                    </Typography>
                  )}
                </Grid>
  
                <Grid item xs={12}>
                  <Typography component='span' fontSize={13.6} marginRight={2}>
                    {pessoaFisica}
                  </Typography>
                  <FormControlLabel
                    control={<Switch onClick={togglePersonType} checked={personType === pessoaJuridica} />}
                    label={pessoaJuridica}
                  />
                </Grid>
  
                {personType === pessoaFisica && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="CPF"
                      placeholder="xxx.xxx.xxx-xx"
                      type="text"
                      {...register("cpf", { required: personType === pessoaFisica })}
                    />
                    {errors?.cpf && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.775rem",
                          display: "flex",
                          alignItems: "center",
                          mt: 1
                        }}
                      >
                        Preencha o CPF do cliente
                      </Typography>
                    )}
                  </Grid>
                )}
  
                {personType === pessoaJuridica && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="CNPJ"
                      placeholder="xx.xxx.xxx/xxxx-xx"
                      type="text"
                      {...register("cnpj", { required: personType === pessoaJuridica })}
                    />
                    {errors?.cnpj && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.775rem",
                          display: "flex",
                          alignItems: "center",
                          mt: 1
                        }}
                      >
                        Preencha o CNPJ do cliente
                      </Typography>
                    )}
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
  
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contato"
                    placeholder="(98)98923-4455"
                    type="text"
                    {...register("contact", { required: true })}
                  />
                  {errors?.contact && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.775rem",
                        display: "flex",
                        alignItems: "center",
                        mt: 1
                      }}
                    >
                      Preencha o contato do cliente
                    </Typography>
                  )}
                </Grid>
  
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
                      <CircularProgress size={20} sx={{marginLeft: "20px"}} />
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
