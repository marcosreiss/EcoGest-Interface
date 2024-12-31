import type { ExpensePayload } from "src/models/expense";

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

import { useCreateExpense } from "src/hooks/useExpense";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// Opções predefinidas para o tipo de despesa
const predefinedTypes = ["Transporte", "Material", "Serviço", "Outro"];

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
    formState: { errors },
  } = useForm<ExpensePayload>();

  const createExpense = useCreateExpense();
  const router = useRouter();
  const { addNotification } = useNotification();

  const onSubmit = (data: ExpensePayload) => {
    const formattedData = {
      ...data,
      weightAmount: Number(data.price), // Converte para número
    };

    createExpense.mutate(formattedData, {
      onSuccess: () => {
        addNotification("Despesa cadastrada com sucesso!", "success");
        router.push("/expenses");
      },
      onError: (error: any) => {
        addNotification(`Erro ao cadastrar despesa: ${error.message}`, "error");
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{`Criar Despesa - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Criar Despesa
                  </Typography>
                </Grid>

                {/* Campo Tipo com Autocomplete */}
                <Grid item xs={12}>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "O tipo é obrigatório." }}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={predefinedTypes}
                        freeSolo
                        value={field.value || ""}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        inputValue={field.value || ""}
                        onInputChange={(_, newInputValue) => field.onChange(newInputValue)}
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

                {/* Campo Descrição */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    placeholder="Descrição da despesa (opcional)"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>

                {/* Campo Valor */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor (R$)"
                    placeholder="Ex: 150.00"
                    type="number"
                    inputProps={{ min: 0, step: "0.01" }}
                    {...register("price", {
                      required: "O valor é obrigatório.",
                      min: { value: 0, message: "O valor não pode ser negativo." },
                    })}
                    error={!!errors.price}
                    helperText={errors.price?.message}
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
