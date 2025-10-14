import axios from "axios";
import { API_URL } from "../utils/url";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // enviar e receber cookies
});

// Force cookie sending
api.defaults.withCredentials = true;

// Função para extrair token do cookie (fallback)
const getTokenFromCookie = () => {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
};

// Interceptor para adicionar Authorization header como fallback
api.interceptors.request.use(
  (config) => {
    // Se não for request de login, adiciona header como fallback
    if (!config.url?.includes("/login")) {
      const token = getTokenFromCookie();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
