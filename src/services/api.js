import axios from "axios";
import { API_URL } from "../utils/url";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const requestLog = new Map();
const MAX_REQUESTS_PER_SECOND = 10;

setInterval(() => {
  requestLog.clear();
}, 1000);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de REQUEST - Adiciona o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const endpoint = `${config.method?.toUpperCase()} ${config.url}`;

    const count = requestLog.get(endpoint) || 0;
    requestLog.set(endpoint, count + 1);

    if (count > MAX_REQUESTS_PER_SECOND) {
      console.warn(`⚠️ LOOP DETECTADO: ${endpoint} (${count} req/s)`);
    }

    // Adiciona o Bearer Token se existir
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPONSE - Trata erro 401 e renova o token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest?.url || "";

      // Endpoints que não devem tentar refresh
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/refresh") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      // Se já estiver refreshing, adiciona à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        window.dispatchEvent(new CustomEvent("unauthorized"));
        return Promise.reject(error);
      }

      try {
        // Tenta renovar o token
        const response = await api.post("/auth/refresh", { refreshToken });
        const { accessToken } = response.data;

        // Salva o novo token
        localStorage.setItem("accessToken", accessToken);

        // Atualiza o header da requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Processa a fila de requisições que falharam
        processQueue(null, accessToken);

        isRefreshing = false;

        // Retenta a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Remove os tokens e desloga
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new CustomEvent("unauthorized"));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
