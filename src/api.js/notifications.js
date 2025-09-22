import api from "../services/api";

// Buscar todas as notificações de um usuário
export const getUserNotifications = async (userId) => {
  try {
    const response = await api.get("/notifications", {
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
    const response = await api.post("/notifications", notificationData);
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

// Criar notificação para o professor (admin) - versão corrigida
export const sendNotificationToTeacher = async (studentName, message) => {
  try {
    const response = await api.post("/notifications/send-to-admin", {
      studentName,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar notificação para o professor:", error);
    throw error;
  }
};

// Função para enviar notificações para professor e membros do time
export const notifyAppointmentScheduled = async (appointment, teamName, teamMembers) => {
  try {
    // Notificar professor/admin
    await createNotification({
      userId: appointment.adminId,
      title: `Nova reunião agendada`,
      message: `O time ${teamName} agendou uma reunião para ${appointment.date} às ${appointment.time}`,
      createdAt: new Date().toISOString(),
    });
    console.log("Notificação enviada para professor/admin");

    // Notificar membros do time
    if (teamMembers && teamMembers.length) {
      await Promise.all(
        teamMembers.map((member) =>
          createNotification({
            userId: member.userId,
            title: `Nova reunião do time`,
            message: `O time ${teamName} agendou uma reunião para ${appointment.date} às ${appointment.time}`,
            createdAt: new Date().toISOString(),
          })
        )
      );
      console.log("Notificação enviada para membros do time");
    }
  } catch (error) {
    console.error("Erro ao enviar notificações:", error);
  }
};
