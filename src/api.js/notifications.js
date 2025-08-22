import api from "../services/api";

// Buscar todas as notificações de um usuário
export const getUserNotifications = async (userId) => {
  try {
    const response = await api.get('/notifications', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw error;
  }
};

// Criar nova notificação
export const createNotification = async (notificationData) => {
  try {
    const response = await api.post(
      '/notifications',
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    throw error;
  }
};

// Deletar notificação
export const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`/notifications/${notificationId}`);
    return true;
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    throw error;
  }
};
