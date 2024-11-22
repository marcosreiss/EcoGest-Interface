import axios from "axios";


const api = axios.create({
    baseURL: "https://ecogest-api.onrender.com/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;