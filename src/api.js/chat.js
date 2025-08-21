import { api } from "../services/api";

// ============ CHAT ROOMS ============

// Buscar salas de chat do usuário
export const fetchUserChatRooms = async (userId) => {
  try {
    const response = await api.get(
      `/chatRooms?participants_like=${userId}&isActive=true`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar chats:", error);
    throw new Error("Erro ao carregar conversas");
  }
};

// Criar nova sala de chat
export const createChatRoom = async (
  participants,
  type = "direct",
  name = null
) => {
  try {
    const newChatRoom = {
      type,
      participants,
      name,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    const response = await api.post("/chatRooms", newChatRoom);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar chat:", error);
    throw new Error("Erro ao iniciar conversa");
  }
};

// Buscar ou criar chat direto entre dois usuários
export const getOrCreateDirectChat = async (userId1, userId2) => {
  try {
    // Buscar chat existente
    const existingChats = await api.get("/chatRooms?type=direct&isActive=true");

    const directChat = existingChats.data.find((chat) => {
      const participants = chat.participants;
      return (
        participants.includes(userId1) &&
        participants.includes(userId2) &&
        participants.length === 2
      );
    });

    if (directChat) {
      return directChat;
    }

    // Se não existe, criar novo
    return await createChatRoom([userId1, userId2], "direct");
  } catch (error) {
    console.error("Erro ao buscar/criar chat direto:", error);
    throw new Error("Erro ao iniciar conversa");
  }
};

// ============ MENSAGENS ============

// Buscar mensagens de uma sala
export const fetchChatMessages = async (chatRoomId, limit = 50) => {
  try {
    const response = await api.get(
      `/chatMessages?chatRoomId=${chatRoomId}&isActive=true&_expand=sender&_limit=${limit}&_sort=createdAt&_order=desc`
    );
    return response.data.reverse(); // Ordem cronológica
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    throw new Error("Erro ao carregar mensagens");
  }
};

// Enviar mensagem
export const sendMessage = async (
  chatRoomId,
  senderId,
  content,
  messageType = "text"
) => {
  try {
    const newMessage = {
      chatRoomId,
      senderId,
      content,
      messageType,
      isActive: true,
      createdAt: new Date().toISOString(),
      readBy: [
        {
          userId: senderId,
          readAt: new Date().toISOString(),
        },
      ],
    };

    const response = await api.post("/chatMessages", newMessage);

    // Atualizar última atividade da sala
    await api.patch(`/chatRooms/${chatRoomId}`, {
      lastActivity: new Date().toISOString(),
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw new Error("Erro ao enviar mensagem");
  }
};

// Marcar mensagem como lida
export const markMessageAsRead = async (messageId, userId) => {
  try {
    const message = await api.get(`/chatMessages/${messageId}`);
    const readBy = message.data.readBy || [];

    // Verificar se já foi lida
    const alreadyRead = readBy.some((read) => read.userId === userId);

    if (!alreadyRead) {
      readBy.push({
        userId,
        readAt: new Date().toISOString(),
      });

      await api.patch(`/chatMessages/${messageId}`, { readBy });
    }

    return true;
  } catch (error) {
    console.error("Erro ao marcar como lida:", error);
    throw new Error("Erro ao marcar mensagem como lida");
  }
};
