import { api } from "../services/api";

// ============ CONVITES PARA TIMES ============

// Buscar convites recebidos pelo usuário
export const fetchUserInvitations = async (userId) => {
  try {
    const response = await api.get(
      `/teamInvitations?toUserId=${userId}&_expand=fromUser&_expand=team&_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar convites:", error);
    throw new Error("Erro ao carregar convites");
  }
};

// Buscar convites enviados pelo usuário
export const fetchSentInvitations = async (userId) => {
  try {
    const response = await api.get(
      `/teamInvitations?fromUserId=${userId}&_expand=toUser&_expand=team&_sort=createdAt&_order=desc`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar convites enviados:", error);
    throw new Error("Erro ao carregar convites enviados");
  }
};

// Enviar convite para um usuário
export const sendTeamInvitation = async (
  fromUserId,
  toUserId,
  teamId,
  message
) => {
  try {
    // Verificar se já existe convite pendente
    const existingInvites = await api.get(
      `/teamInvitations?fromUserId=${fromUserId}&toUserId=${toUserId}&teamId=${teamId}&status=pending`
    );

    if (existingInvites.data.length > 0) {
      throw new Error("Já existe um convite pendente para este usuário");
    }

    const newInvitation = {
      fromUserId,
      toUserId,
      teamId,
      message,
      status: "pending",
      invitationType: "team_member",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    };

    const response = await api.post("/teamInvitations", newInvitation);

    // Criar notificação
    await createNotification(
      toUserId,
      "team_invitation",
      "Convite para Time",
      `Você recebeu um convite para se juntar a um time!`,
      {
        invitationId: response.data.id,
        teamId,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar convite:", error);
    throw error;
  }
};

// Responder a convite (aceitar/recusar)
export const respondToInvitation = async (invitationId, response, userId) => {
  try {
    const invitation = await api.get(`/teamInvitations/${invitationId}`);

    if (!invitation.data || invitation.data.toUserId !== userId) {
      throw new Error("Convite não encontrado ou não autorizado");
    }

    if (invitation.data.status !== "pending") {
      throw new Error("Este convite já foi respondido");
    }

    // Atualizar status do convite
    await api.patch(`/teamInvitations/${invitationId}`, {
      status: response, // 'accepted' ou 'declined'
      respondedAt: new Date().toISOString(),
    });

    if (response === "accepted") {
      // Adicionar usuário ao time
      const { addMemberToTeam } = await import("./teams");
      await addMemberToTeam(invitation.data.teamId, {
        userId: userId,
        role: "member",
        specialization: "Membro",
      });

      // Atualizar usuário para ter grupo
      const { updateUser } = await import("./users");
      await updateUser(userId, { hasGroup: true });
    }

    return true;
  } catch (error) {
    console.error("Erro ao responder convite:", error);
    throw error;
  }
};

// ============ NOTIFICAÇÕES ============

// Criar notificação
export const createNotification = async (
  userId,
  type,
  title,
  message,
  data = {}
) => {
  try {
    const notification = {
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const response = await api.post("/notifications", notification);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    throw new Error("Erro ao criar notificação");
  }
};

// Buscar notificações do usuário
export const fetchUserNotifications = async (userId, limit = 20) => {
  try {
    const response = await api.get(
      `/notifications?userId=${userId}&_sort=createdAt&_order=desc&_limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);
    throw new Error("Erro ao carregar notificações");
  }
};

// Marcar notificação como lida
export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.patch(`/notifications/${notificationId}`, {
      isRead: true,
      readAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw new Error("Erro ao marcar como lida");
  }
};

// ============ PRESENÇA DE USUÁRIOS ============

// Atualizar presença do usuário
export const updateUserPresence = async (userId, status, activity = null) => {
  try {
    const presenceData = {
      userId,
      status, // 'looking_for_team', 'recruiting', 'available', 'busy'
      lastSeen: new Date().toISOString(),
      isOnline: true,
      currentActivity: activity, // 'common_room', 'browsing_forum', 'in_chat', etc.
    };

    // Verificar se já existe registro de presença
    const existingPresence = await api.get(`/userPresence?userId=${userId}`);

    if (existingPresence.data.length > 0) {
      // Atualizar existente
      await api.patch(
        `/userPresence/${existingPresence.data[0].id}`,
        presenceData
      );
    } else {
      // Criar novo
      await api.post("/userPresence", presenceData);
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar presença:", error);
    throw new Error("Erro ao atualizar status");
  }
};

// Buscar usuários online
export const fetchOnlineUsers = async (excludeUserId = null) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    let query = `/userPresence?isOnline=true&lastSeen_gte=${fiveMinutesAgo}&_expand=user`;

    if (excludeUserId) {
      query += `&userId_ne=${excludeUserId}`;
    }

    const response = await api.get(query);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários online:", error);
    throw new Error("Erro ao carregar usuários online");
  }
};
