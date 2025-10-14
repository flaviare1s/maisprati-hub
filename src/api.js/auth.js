import api, { clearToken, setToken } from "../services/api.js";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    // Extrai token da resposta (se o backend enviar)
    const token = response.data?.token || response.data?.access_token;
    if (token) {
      setToken(token); // Salva no localStorage
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

// Função para envio de e-mail com token
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};


// Função para redefinição de senha
export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

// Função para logout do usuário
export const logoutUser = async () => {
  clearToken(); // Limpa localStorage
  return api.post("/auth/logout", {}, { withCredentials: true });
};
