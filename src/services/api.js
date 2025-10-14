import axios from "axios";
import { API_URL } from "../utils/url";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enviar e receber cookies
});

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Sessão expirada ou usuário não autenticado
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;