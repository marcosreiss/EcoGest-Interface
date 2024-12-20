import type { SubmitHandler } from "react-hook-form";
import type { ExpensePayload } from "src/models/expense";

import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "src/routes/hooks";

import { useUpdateExpense, useGetExpenseById } from "src/hooks/useExpense";

import { CONFIG } from "src/config-global";
import { DashboardContent } from "src/layouts/dashboard";
import { useNotification } from "src/context/NotificationContext";

// Opções predefinidas para o tipo de despesa
const predefinedTypes = ["Transporte", "Material", "Serviço", "Outro"];

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const expenseId = Number(id);

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
  } = useForm<ExpensePayload>();

  const updateExpense = useUpdateExpense();
  const router = useRouter();
  const { addNotification } = useNotification();

  const { data: expense, isLoading, isError, error } = useGetExpenseById(expenseId);

  useEffect(() => {
    if (expense) {
      setValue("type", expense.type);
      setValue("description", expense.description || "");
      setValue("weightAmount", expense.weightAmount || 0);
    }
  }, [expense, setValue]);

  const onSubmit: SubmitHandler<ExpensePayload> = (data) => {
    const updatedData = {
      ...data,
      weightAmount: Number(data.weightAmount), // Certifica que o valor é numérico
    };

    updateExpense.mutate(
      { id: expenseId, data: updatedData },
      {
        onSuccess: () => {
          addNotification("Despesa atualizada com sucesso!", "success");
          router.push("/expenses");
        },
        onError: (err: any) => {
          addNotification(`Erro ao atualizar despesa: ${err.message}`, "error");
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
            Erro ao carregar a despesa: {error?.message}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Editar Despesa - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <Box sx={formStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    Editar Despesa
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
                    {...register("weightAmount", {
                      required: "O valor é obrigatório.",
                      min: { value: 0, message: "O valor não pode ser negativo." },
                    })}
                    error={!!errors.weightAmount}
                    helperText={errors.weightAmount?.message}
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
                    disabled={updateExpense.isPending}
                  >
                    Atualizar
                    {updateExpense.isPending && (
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
