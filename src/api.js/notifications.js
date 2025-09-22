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

// Criar notificação para o professor (admin)
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
export const notifyAppointmentScheduled = async (
  appointment,
  teamName,
  teamMembers,
  adminId
) => {
  try {
    const { date, time, teamId, studentId } = appointment;

    // Se tem time, notificar como reunião do time
    if (teamId && teamName) {
      // Notificar professor/admin sobre reunião do time
      await createNotification({
        userId: adminId,
        title: "Nova reunião do time",
        message: `O time ${teamName} agendou uma reunião para ${date} às ${time}`,
        createdAt: new Date().toISOString(),
      });
      console.log("Notificação enviada para professor/admin sobre time");

      // Notificar TODOS os membros do time (incluindo quem agendou)
      if (teamMembers && teamMembers.length) {
        await Promise.all(
          teamMembers.map((member) =>
            createNotification({
              userId: member.userId,
              title: "Nova reunião do time",
              message: `O time ${teamName} agendou uma reunião para ${date} às ${time}`,
              createdAt: new Date().toISOString(),
            })
          )
        );
        console.log("Notificação enviada para membros do time");
      }
    } else {
      // Se não tem time, notificar como reunião individual
      await createNotification({
        userId: adminId,
        title: "Nova reunião agendada",
        message: `Um aluno agendou uma reunião para ${date} às ${time}`,
        createdAt: new Date().toISOString(),
      });

      // Notificar também o próprio estudante
      await createNotification({
        userId: studentId,
        title: "Nova reunião marcada",
        message: `Sua reunião foi marcada para ${date} às ${time}`,
        createdAt: new Date().toISOString(),
      });

      console.log(
        "Notificação enviada para professor/admin e estudante sobre reunião individual"
      );
    }
  } catch (error) {
    console.error("Erro ao enviar notificações:", error);
  }
};

// Função para notificar cancelamento de reunião
export const notifyAppointmentCanceled = async (
  appointment,
  teamName,
  teamMembers,
  studentName,
  adminId,
  canceledByAdmin = false // <- novo parâmetro
) => {
  try {
    const { date, time, teamId } = appointment;

    if (teamId && teamName) {
      // Montar mensagem de acordo com quem cancelou
      const messageForAdmin = canceledByAdmin
        ? `Você cancelou a reunião do time ${teamName} marcada para ${date} às ${time}`
        : `O time ${teamName} cancelou a reunião marcada para ${date} às ${time}`;

      const messageForMembers = canceledByAdmin
        ? `O professor cancelou a reunião do time ${teamName} marcada para ${date} às ${time}`
        : `O time ${teamName} cancelou a reunião marcada para ${date} às ${time}`;

      // Notificar professor/admin
      await createNotification({
        userId: adminId,
        title: "Reunião do time cancelada",
        message: messageForAdmin,
        createdAt: new Date().toISOString(),
      });

      // Notificar membros do time
      if (teamMembers && teamMembers.length) {
        await Promise.all(
          teamMembers.map((member) =>
            createNotification({
              userId: member.userId,
              title: "Reunião do time cancelada",
              message: messageForMembers,
              createdAt: new Date().toISOString(),
            })
          )
        );
      }
    } else {
      // Cancelamento individual
      await createNotification({
        userId: adminId,
        title: "Reunião cancelada",
        message: canceledByAdmin
          ? `Você cancelou a reunião de ${studentName} marcada para ${date} às ${time}`
          : `O aluno ${studentName} cancelou a reunião marcada para ${date} às ${time}`,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Erro ao enviar notificações de cancelamento:", error);
  }
};
