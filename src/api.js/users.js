import api from "../services/api.js";

export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const disableWantsGroup = async (userId) => {
  try {
    const response = await api.patch(`/users/${userId}/wants-group`);
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar preferência de grupo:", error);
    throw error;
  }
};

// Função para buscar dados completos do usuário atual
export const getCurrentUserData = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    // 401/403 - não há usuário logado (situação normal)
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }

    // 500/502/503 - problemas temporários do servidor
    if (error.response?.status >= 500) {
      console.warn("Servidor temporariamente indisponível, mantendo sessão");
      throw new Error("SERVER_ERROR"); // Erro específico para problemas de servidor
    }

    // Outros erros (rede, timeout, etc.)
    console.error("Erro ao buscar dados do usuário atual:", error);
    throw error;
  }
};

// Inativar usuário (próprio usuário ou admin)
export const deactivateUser = async (userId) => {
  try {
    const response = await api.patch(`/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("Erro ao inativar usuário:", error);
    throw error;
  }
};

// Reativar usuário (apenas admin)
export const activateUser = async (userId) => {
  try {
    const response = await api.patch(`/users/${userId}/activate`);
    return response.data;
  } catch (error) {
    console.error("Erro ao reativar usuário:", error);
    throw error;
  }
};

