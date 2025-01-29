import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useCreateEntry } from "src/hooks/useEntry";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { EntryType, type EntryPayload } from "src/models/entry";
import { useNotification } from "src/context/NotificationContext";

// Opções predefinidas para o tipo e subtipo de despesa
const predefinedTypes = ["Entrada", "Saída"];
const predefinedSubtypes = [
"Peças e Serviços",
"Folha de pagamento",
"Diárias",
"Mercedes 710 - HPP1C70",
"Mercedes 709 - JKW6I19",
"Mercedes 708 - LVR7727",
"Imposto ICMS Frete",
"Pag Frete",
"Vale Transporte",
"Impostos Federais",
"Trabalhos Profissionais",
"Suprimentos",
"EPIs",
"Manutenção Prensa",
"Manutenção Empilhadeira",
"Pagamento a fornecedores",
"Gastos com energia e internet",
"Peças e Serviços",
"Folha de pagamento",
"Diárias",
"Mercedes 710 - HPP1C70",
"Mercedes 709 - JKW6I19",
"Mercedes 708 - LVR7727",
"Imposto ICMS Frete",
"Pag Frete",
"Vale Transporte",
"Impostos Federais",
"Trabalhos Profissionais",
"Suprimentos",
"EPIs",
"Manutenção Prensa",
"Manutenção Empilhadeira",
"Pagamento a fornecedores",
"Gastos com energia e internet",
"Sócios",
"Outro",
];

export default function CreateExpensePage() {
  const formStyle = {
    mx: "auto",
    p: 3,
    boxShadow: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
  };

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<EntryPayload>();

  const createExpense = useCreateEntry();
  const router = useRouter();
  const { addNotification } = useNotification();

  const setEntryType = (frontendType: string) => {
    const entryType = frontendType === "Entrada" ? EntryType.ganho : EntryType.perda;
    setValue("type", entryType);
  };

  const onSubmit = (data: EntryPayload) => {
    // 1. Converte vírgula para ponto
    const valueStr = String(data.value).replace(",", ".");
    // 2. Converte o campo em número (double)
    const formattedValue = parseFloat(valueStr);

    const formattedData: EntryPayload = {
      ...data,
      value: formattedValue,
    };

    createExpense.mutate(formattedData, {
      onSuccess: () => {
        addNotification("Lançamento cadastrado com sucesso!", "success");
        router.push("/expenses");
      },
      onError: (error: any) => {
        addNotification(`Erro ao cadastrar Lançamento: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Lançamento - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="lg">
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Lançamento
                  </Typography>
                </Grid>

                {/* Campo Tipo com Autocomplete */}
                <Grid item xs={12}>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "O tipo é obrigatório." }}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={predefinedTypes}
                        onChange={(_, newValue) => {
                          field.onChange(newValue);
                          setEntryType(newValue || "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tipo"
                            placeholder="Selecione ou digite o tipo"
                            error={!!errors.type}
                            helperText={errors.type?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Campo Subtipo com Autocomplete */}
                <Grid item xs={12}>
                  <Controller
                    name="subtype"
                    control={control}
                    rules={{ required: "O subtipo é obrigatório." }}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={predefinedSubtypes}
                        freeSolo
                        value={field.value || ""}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        inputValue={field.value || ""}
                        onInputChange={(_, newInputValue) =>
                          field.onChange(newInputValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Subtipo"
                            placeholder="Selecione ou digite o subtipo"
                            error={!!errors.subtype}
                            helperText={errors.subtype?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Campo Descrição */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    placeholder="Descrição do Lançamento (opcional)"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>

                {/* Campo Valor (permitindo vírgula) */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor (R$)"
                    placeholder="Ex: 150,00"
                    type="text" // <-- texto para aceitar vírgula
                    inputProps={{ min: 0, step: "0.01" }}
                    {...register("value", {
                      required: "O valor é obrigatório.",
                      min: { value: 0, message: "O valor não pode ser negativo." },
                    })}
                    error={!!errors.value}
                    helperText={errors.value?.message}
                  />
                </Grid>

                {/* Campo Data e Hora */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data e Hora"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...register("date_time", {
                      required: "A data e hora são obrigatórias.",
                    })}
                    error={!!errors.date_time}
                    helperText={errors.date_time?.message}
                  />
                </Grid>

                {/* Botão de Enviar */}
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
