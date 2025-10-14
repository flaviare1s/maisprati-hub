import axios from "axios";
import { API_URL } from "../utils/url";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.defaults.withCredentials = true;

// ========== GERENCIAMENTO DE TOKEN ==========
const TOKEN_KEY = "access_token";

const getToken = () => {
  // 1. Tenta cookie primeiro (para dev local)
  const cookieMatch = document.cookie.match(/access_token=([^;]+)/);
  if (cookieMatch) {
    return cookieMatch[1];
  }

  // 2. Fallback: localStorage (para produção cross-origin)
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// ========== PROTEÇÃO ANTI-LOOP ==========
const requestLog = new Map();
const MAX_REQUESTS_PER_SECOND = 10;

setInterval(() => {
  requestLog.clear();
}, 1000);

// ========== CONTROLE DE LOGOUT ==========
let isLogoutDispatched = false;
let logoutTimeout = null;

// ========== INTERCEPTOR DE REQUEST ==========
api.interceptors.request.use(
  (config) => {
    // Adiciona token em todas as requisições (exceto login/register)
    if (!config.url?.includes("/login") && !config.url?.includes("/register")) {
      const token = getToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Anti-loop: detecção
    const endpoint = `${config.method?.toUpperCase()} ${config.url}`;
    const count = requestLog.get(endpoint) || 0;
    requestLog.set(endpoint, count + 1);

    if (count > MAX_REQUESTS_PER_SECOND) {
      console.warn(`⚠️ LOOP DETECTADO: ${endpoint} (${count} req/s)`);
      console.trace("Stack trace:");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========== INTERCEPTOR DE RESPONSE ==========
api.interceptors.response.use(
  (response) => {
    // Salva token após login/register
    if (
      response.config?.url?.includes("/login") ||
      response.config?.url?.includes("/register")
    ) {
      const token = response.data?.token;
      if (token) {
        setToken(token);
        console.log("✅ Token salvo com sucesso");
      }
    }

    // Reset do flag de logout
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
    // Logout automático em 401 (endpoints protegidos)
    if (error.response?.status === 401) {
      const url = error.config?.url || "";

      const isAuthEndpoint =
        url.includes("/auth/me") ||
        url.includes("/auth/check") ||
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/forgot-password") ||
        url.includes("/auth/reset-password");

      if (!isAuthEndpoint && !isLogoutDispatched) {
        isLogoutDispatched = true;
        clearToken();

        logoutTimeout = setTimeout(() => {
          console.log("🚪 Sessão expirada - fazendo logout");
          window.dispatchEvent(new CustomEvent("unauthorized"));
          isLogoutDispatched = false;
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

// Exporta funções auxiliares
export { setToken, clearToken, getToken };
export default api;
