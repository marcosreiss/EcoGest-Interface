import axios from "axios";


const api = axios.create({
  baseURL: "https://ecogest-api.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token no cabeçalho em todas as requisições
api.interceptors.request.use((config) => {

  console.log("Request Body:", config.data);
  console.log("Request Params:", config.params);
  console.log("Token:", config.headers.Authorization);

  return config;
});

export default api;
