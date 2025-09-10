import api from "../services/api";

// Buscar progresso do projeto por teamId
export const fetchProjectProgress = async (teamId) => {
  try {
    const response = await api.get(`/projectProgress/${teamId}`);
    return response.data || null;
  } catch (error) {
    console.error("Erro ao buscar progresso do projeto:", error);

    if (error.response?.status === 404) {
      return null;
    }

    throw new Error("Erro ao carregar progresso do projeto");
  }
};

export const createProjectProgress = async (teamId) => {
  try {
    const response = await api.post(`/projectProgress/create/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar progresso do projeto:", error);
    throw new Error("Erro ao criar progresso do projeto");
  }
};

// Atualizar progresso do projeto
export const updateProjectProgress = async (progressId, phases) => {
  try {
    const response = await api.put(`/projectProgress/${progressId}`, {
      phases,
      lastUpdated: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar progresso do projeto:", error);
    throw new Error("Erro ao atualizar progresso do projeto");
  }
};

// Atualizar status de uma fase específica
export const updatePhaseStatus = async (
  teamId,
  phaseTitle,
  newStatus
) => {
  try {
    const response = await api.put(
      `/projectProgress/${teamId}/phase?title=${phaseTitle}&status=${newStatus.toUpperCase()}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar status da fase:", error);
    throw new Error("Erro ao atualizar status da fase");
  }
};

// Obter estatísticas do projeto
export const getProjectStatistics = async (teamId) => {
  try {
    const progress = await fetchProjectProgress(teamId);

    if (!progress) {
      return {
        totalPhases: 7,
        todoPhases: 7,
        inProgressPhases: 0,
        completedPhases: 0,
        completionPercentage: 0,
      };
    }

    const phases = progress.phases || [];
    const todoPhases = phases.filter((p) => p.status === "TODO").length;
    const inProgressPhases = phases.filter(
      (p) => p.status === "IN_PROGRESS"
    ).length;
    const completedPhases = phases.filter((p) => p.status === "DONE").length;
    const totalPhases = phases.length;

    return {
      totalPhases,
      todoPhases,
      inProgressPhases,
      completedPhases,
      completionPercentage: Math.round((completedPhases / totalPhases) * 100),
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw new Error("Erro ao obter estatísticas do projeto");
  }
};
