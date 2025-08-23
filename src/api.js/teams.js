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

// Buscar roles
export const fetchRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    return [];
  }
};

// Buscar tipos de subliderança
export const fetchSubLeaderTypes = async () => {
  try {
    const response = await api.get("/subLeaderTypes");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tipos de subliderança:", error);
    return [];
  }
};

// Validar código de segurança do time
export const validateTeamCode = async (teamId, securityCode) => {
  const teams = await fetchTeams();
  const team = teams.find((t) => t.id === teamId);

  if (!team) throw new Error("Time não encontrado");
  if (team.securityCode !== securityCode)
    throw new Error("Código de segurança inválido");

  return team;
};

export const addMemberToTeam = async (teamId, memberData) => {
  try {
    const teamResponse = await api.get(`/teams/${teamId}`);
    const team = teamResponse.data;

    if (team.members.length >= team.maxMembers) {
      throw new Error("Time já está cheio");
    }

    const isAlreadyMember = team.members.some(
      (member) => member.userId === memberData.userId
    );
    if (isAlreadyMember) {
      throw new Error("Usuário já é membro deste time");
    }

    const newMember = {
      userId: memberData.userId,
      role: memberData.role || "member",
      specialization: memberData.specialization || "",
      subLeaderType: memberData.subLeaderType || null,
      joinedAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };

    const updatedMembers = [...team.members, newMember];

    const updatedTeam = {
      ...team,
      members: updatedMembers,
      currentMembers: updatedMembers.length,
    };

    const teamUpdateResult = await api.put(`/teams/${teamId}`, updatedTeam);

    const userResponse = await api.get(`/users/${memberData.userId}`);
    const userData = userResponse.data;

    const updatedUserData = {
      ...userData,
      isFirstLogin: false,
      hasGroup: true,
      teamId: teamId,
    };

    const userUpdateResult = await api.put(`/users/${memberData.userId}`, updatedUserData);
    console.log("Usuário atualizado:", userUpdateResult.data);

    const verifyUser = await api.get(`/users/${memberData.userId}`);
    console.log("🔍 Verificação - usuário após update:", verifyUser.data);

    const result = { 
      updatedTeam: teamUpdateResult.data, 
      updatedUserData: verifyUser.data 
    };
    return result;

  } catch (error) {
    console.error("Erro em addMemberToTeam:", error);
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
  const team = await fetchTeamById(teamId);

  const memberIndex = team.members.findIndex(
    (member) => member.userId === userId
  );
  if (memberIndex === -1) throw new Error("Membro não encontrado no time");

  const updatedMembers = [...team.members];
  updatedMembers[memberIndex] = {
    ...updatedMembers[memberIndex],
    role: newRole,
    subLeaderType: newRole === "subleader" ? subLeaderType : null,
  };

  const updatedTeam = {
    ...team,
    members: updatedMembers,
    currentMembers: updatedMembers.length
  };
  const response = await api.put(`/teams/${teamId}`, updatedTeam);
  return response.data;
};

// Buscar time com dados completos dos membros
export const getTeamWithMembers = async (teamId) => {
  const [team, users] = await Promise.all([
    fetchTeamById(teamId),
    api.get("/users").then((res) => res.data),
  ]);

  const membersWithUserData = team.members.map((member) => {
    const userData = users.find(
      (u) => u.id.toString() === member.userId.toString()
    );
    return { ...member, user: userData || null };
  });

  return { ...team, members: membersWithUserData };
};

// Verificar se usuário está em algum time ativo
export const isUserInActiveTeam = (user, teams) => {
  if (!user || !teams) return false;

  return teams.some(
    (team) =>
      team.isActive &&
      team.members.some(
        (member) => member.userId === user.id && member.isActive
      )
  );
};

// Criar um novo time
export const createTeam = async (teamData) => {
  try {
    const newTeam = {
      ...teamData,
      members: [],
      currentMembers: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const response = await api.post('/teams', newTeam);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar time:', error);
    throw new Error('Não foi possível criar o time');
  }
};

// Remover membro do time (JSON Server)
export const deleteTeamMember = async (teamId, userId) => {
  try {
    // Pega o time
    const teamResponse = await api.get(`/teams/${teamId}`);
    const team = teamResponse.data;

    // Filtra o membro que quer sair
    const updatedMembers = team.members.filter(
      (member) => member.userId.toString() !== userId.toString()
    );

    // Atualiza o time
    const updatedTeam = {
      ...team,
      members: updatedMembers,
      currentMembers: updatedMembers.length,
    };

    await api.put(`/teams/${teamId}`, updatedTeam);

    return true;
  } catch (error) {
    console.error("Erro ao remover membro do time:", error);
    throw error;
  }
};
