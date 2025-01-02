import type { LoginPayload, LoginResponse } from "src/services/loginService";

import { useState } from 'react';
import { useForm } from "react-hook-form";

import Box from '@mui/material/Box';
import { Grid } from "@mui/material";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useLogin } from "src/hooks/useLogin";

import { useAuth } from "src/context/AuthContext";
import { useNotification } from "src/context/NotificationContext";

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>();


  const { setToken, setUsername, setRole } = useAuth();
  const loginMutation = useLogin();
  const { addNotification } = useNotification();



  const handleSignIn = (data: LoginPayload) => {
    console.log(data);
    loginMutation.mutate(data, {
      onSuccess: (response: LoginResponse) => {
        addNotification("Login realizado com sucesso!", "success");
        if (response.token) {
          setToken(response.token);
          setUsername(response.user.username)
          setRole(response.user.role)
        }
      },
      onError: () => {
        addNotification("Erro ao fazer login, tente novamente", "error")
      },
    });
  }




  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <Grid container mb={3}>
        <TextField
          fullWidth
          // name="email"
          label="Usuário"
          InputLabelProps={{ shrink: true }}
          {...register("username", { required: true })}
        />
        {errors?.username && (
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
            Preencha seu email
          </Typography>
        )}
      </Grid>

      <Grid container mb={3}>
        <TextField
          fullWidth
          // name="password"
          label="Senha"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register("password", { required: true })}
        />
        {errors?.password && (
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
            Preencha sua senha
          </Typography>
        )}
      </Grid>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={() => handleSubmit(handleSignIn)()}
        sx={{
          "&:hover": {
            backgroundColor: "#2E7D32", // Cor verde ecológica
            color: "#ffffff", // Cor do texto branco para contraste
          },
        }}
      >
        Entrar
      </LoadingButton>

    </Box>
  );

  return (
    <>

      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Login</Typography>
      </Box>
      {renderForm}

      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" paddingTop={2}>
        <Typography sx={{ color: "#2E7D32" }}>
          ECO BRITO RECICLAGEM LTDA.
        </Typography>
      </Box>

    </>
  );
}