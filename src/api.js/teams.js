import api from "../services/api.js";

export const fetchTeams = async () => {
  const response = await api.get("/teams");
  return response.data;
};

export const fetchTeamById = async (teamId) => {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
};

export const fetchRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const fetchSubLeaderTypes = async () => {
  const response = await api.get("/subLeaderTypes");
  return response.data;
};

export const validateTeamCode = async (teamId, securityCode) => {
  const teams = await fetchTeams();
  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    throw new Error("Time não encontrado");
  }

  if (team.securityCode !== securityCode) {
    throw new Error("Código de segurança inválido");
  }

  return team;
};

export const addMemberToTeam = async (teamId, memberData) => {
  const team = await fetchTeamById(teamId);

  if (team.members.length >= team.maxMembers) {
    throw new Error("Time já está cheio");
  }

  // Verificar se o usuário já é membro
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

  const updatedTeam = {
    ...team,
    members: [...team.members, newMember],
    currentMembers: team.members.length + 1,
  };

  // Atualizar o time
  const teamResponse = await api.put(`/teams/${teamId}`, updatedTeam);

  // Atualizar o usuário para marcar que não é mais primeiro login
  const userResponse = await api.get(`/users/${memberData.userId}`);
  const userData = userResponse.data;

  const updatedUserData = {
    ...userData,
    isFirstLogin: false,
  };

  await api.put(`/users/${memberData.userId}`, updatedUserData);

  return teamResponse.data;
};

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
  if (memberIndex === -1) {
    throw new Error("Membro não encontrado no time");
  }

  const updatedMembers = [...team.members];
  updatedMembers[memberIndex] = {
    ...updatedMembers[memberIndex],
    role: newRole,
    subLeaderType: newRole === "subleader" ? subLeaderType : null,
  };

  const updatedTeam = {
    ...team,
    members: updatedMembers,
  };

  const response = await api.put(`/teams/${teamId}`, updatedTeam);
  return response.data;
};

export const getTeamWithMembers = async (teamId) => {
  const [team, users] = await Promise.all([
    fetchTeamById(teamId),
    api.get("/users").then((res) => res.data),
  ]);

  const membersWithUserData = team.members.map((member) => {
    const userData = users.find(
      (user) => user.id.toString() === member.userId.toString()
    );
    return {
      ...member,
      user: userData,
    };
  });

  return {
    ...team,
    members: membersWithUserData,
  };
};
