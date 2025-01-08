import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 

  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token no cabeçalho em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(import.meta.env.VITE_BASE_URL);

  // console.log("Request Body:", config.data);
  // console.log("Request Params:", config.params);
  // console.log("Token:", config.headers.Authorization);
  
  return config;
});

export default api;
