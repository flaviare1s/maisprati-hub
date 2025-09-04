import api from "../services/api.js";

// Buscar todos os times
export const fetchTeams = async () => {
  try {
    const response = await api.get("/teams");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar times:", error);
    return [];
  }
};

// Buscar times ativos
export const fetchActiveTeams = async () => {
  try {
    const response = await api.get("/teams/active");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar times ativos:", error);
    return [];
  }
};

// Buscar time pelo ID
export const fetchTeamById = async (teamId) => {
  try {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar time pelo ID:", error);
    throw new Error("Time não encontrado");
  }
};

// Buscar time por código de segurança
export const fetchTeamByCode = async (securityCode) => {
  try {
    const response = await api.get(`/teams/code/${securityCode}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar time por código:", error);
    throw new Error("Time não encontrado com este código");
  }
};

// Buscar roles disponíveis
export const fetchRoles = async () => {
  try {
    const response = await api.get("/teams/roles");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    return [];
  }
};

// Buscar tipos de subliderança
export const fetchSubLeaderTypes = async () => {
  try {
    const response = await api.get("/teams/subLeaderTypes");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tipos de subliderança:", error);
    return [];
  }
};

// Validar código de segurança do time
export const validateTeamCode = async (teamId, securityCode) => {
  try {
    const response = await api.post(`/teams/${teamId}/validate`, {
      securityCode: securityCode,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao validar código do time:", error);
    throw error;
  }
};

// Adicionar membro ao time
export const addMemberToTeam = async (teamId, memberData) => {
  try {
    const response = await api.post(`/teams/${teamId}/members`, memberData);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar membro ao time:", error);
    console.error("Detalhes do erro:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Atualizar role de membro
export const updateMemberRole = async (
  teamId,
  userId,
  newRole,
  subLeaderType = null
) => {
  try {
    const requestData = { role: newRole };
    if (subLeaderType) {
      requestData.subLeaderType = subLeaderType;
    }

    const response = await api.put(
      `/teams/${teamId}/members/${userId}/role`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar role do membro:", error);
    throw error;
  }
};

// Remover membro do time
export const removeMemberFromTeam = async (teamId, userId, reason = null) => {
  try {
    const requestBody = reason ? { reason } : {};
    const response = await api.delete(`/teams/${teamId}/members/${userId}`, {
      data: requestBody,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao remover membro do time:", error);
    throw error;
  }
};

// Verificar se usuário está em time ativo
export const checkUserTeamStatus = async (userId) => {
  try {
    const response = await api.get(`/teams/user/${userId}/status`);
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar status do usuário no time:", error);
    return { isInActiveTeam: false };
  }
};

// Criar um novo time
export const createTeam = async (teamData, creatorUserId) => {
  try {
    const response = await api.post(
      `/teams?creatorUserId=${creatorUserId}`,
      teamData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar time:", error);
    throw error;
  }
};

// Alterar status ativo/inativo do time
export const toggleTeamStatus = async (teamId) => {
  try {
    const response = await api.patch(`/teams/${teamId}/status`);
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar status do time:", error);
    throw error;
  }
};

// Buscar time com dados completos dos membros
export const getTeamWithMembers = async (teamId) => {
  try {
    // No backend, o time já vem com as informações dos membros
    const team = await fetchTeamById(teamId);
    return team;
  } catch (error) {
    console.error("Erro ao buscar time com membros:", error);
    throw error;
  }
};

// Verificar se usuário está em algum time ativo (função auxiliar)
export const isUserInActiveTeam = async (userId) => {
  try {
    const result = await checkUserTeamStatus(userId);
    return result.isInActiveTeam;
  } catch (error) {
    console.error("Erro ao verificar se usuário está em time ativo:", error);
    return false;
  }
};
