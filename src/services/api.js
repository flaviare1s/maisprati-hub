import axios from "axios";
import { API_URL } from "../utils/url";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enviar e receber cookies
});

// Controle para evitar múltiplos dispatches de logout
let isLogoutDispatched = false;
let logoutTimeout = null;

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => {
    // Reset do flag se a requisição foi bem-sucedida
    if (isLogoutDispatched) {
      isLogoutDispatched = false;
      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
        logoutTimeout = null;
      }
    }
    return response;
  },
  (error) => {
    // Só dispara logout para 401 em endpoints não-públicos
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      // Não fazer logout automático para endpoints de verificação
      const isCheckEndpoint =
        url.includes("/auth/me") || url.includes("/auth/check");

      if (!isCheckEndpoint && !isLogoutDispatched) {
        isLogoutDispatched = true;

        // Debounce para evitar múltiplos logouts
        logoutTimeout = setTimeout(() => {
          window.dispatchEvent(new CustomEvent("unauthorized"));
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
