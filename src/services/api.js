import axios from "axios";
const stieName =
    window.location.hostname === "localhost"
        ? "http://localhost:4000/api"
        : "https://b2b-server-nz6h.onrender.com/api";

const api = axios.create({
    baseURL: stieName,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return config;
});

export default api;
