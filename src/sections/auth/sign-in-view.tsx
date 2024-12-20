import type { LoginPayload } from "src/services/loginService";

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

  
  const { setToken } = useAuth();
  const loginMutation = useLogin();
  const { addNotification } = useNotification();



  const handleSignIn = (data: LoginPayload) => {
    console.log(data);
    loginMutation.mutate(data, {
      onSuccess: (response: { token: string | null; }) => {
        addNotification("Login realizado com sucesso!", "success");
        if(response.token){
          setToken(response.token);
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
          label="Email address"
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
          label="Password"
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
      >
        Entrar
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Eco♻️Gest</Typography>
      </Box>

      {renderForm}

    </>
  );
}