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

const getTokenFromCookie = () => {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
};

const requestLog = new Map();
const MAX_REQUESTS_PER_SECOND = 10;

setInterval(() => {
  requestLog.clear();
}, 1000);

let isLogoutDispatched = false;
let logoutTimeout = null;

api.interceptors.request.use(
  (config) => {
    if (!config.url?.includes("/login") && !config.url?.includes("/register")) {
      const token = getTokenFromCookie();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

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

api.interceptors.response.use(
  (response) => {
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

        logoutTimeout = setTimeout(() => {
          console.log("🚪 Disparando logout por 401 em endpoint protegido");
          window.dispatchEvent(new CustomEvent("unauthorized"));
          isLogoutDispatched = false;
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
