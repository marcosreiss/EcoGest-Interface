import axios from "axios";

const api = axios.create({
  baseURL: "http://ecogestapp.sytes.net:4000/api",
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

  // console.log("Request Body:", config.data);
  // console.log("Request Params:", config.params);
  // console.log("Token:", config.headers.Authorization);
  
  return config;
});

export default api;
