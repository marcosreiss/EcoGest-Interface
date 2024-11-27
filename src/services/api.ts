import axios from "axios";

const api = axios.create({
  baseURL: "https://ecogest-api.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token no cabeçalho em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
