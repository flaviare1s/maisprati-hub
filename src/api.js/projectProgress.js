import api from "../services/api";

// Buscar progresso do projeto por teamId
export const fetchProjectProgress = async (teamId) => {
  try {
    const response = await api.get(`/projectProgress?teamId=${teamId}`);
    return response.data[0] || null; // Retorna o primeiro (único) resultado
  } catch (error) {
    console.error("Erro ao buscar progresso do projeto:", error);
    throw new Error("Erro ao carregar progresso do projeto");
  }
};

export const createProjectProgress = async (teamId) => {
  const initialPhases = [
    {
      id: 1,
      title: "Frontend",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
    {
      id: 2,
      title: "Backend",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
    {
      id: 3,
      title: "Design",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
    {
      id: 4,
      title: "Banco de Dados",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
    {
      id: 5,
      title: "Testes",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
    {
      id: 6,
      title: "Deploy",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
    {
      id: 7,
      title: "Documentação",
      status: "todo",
      startedAt: null,
      completedAt: null
    },
  ];

  try {
    const newProgress = {
      teamId: teamId.toString(),
      phases: initialPhases,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const response = await api.post("/projectProgress", newProgress);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar progresso do projeto:", error);
    throw new Error("Erro ao criar progresso do projeto");
  }
};

// Atualizar progresso do projeto
export const updateProjectProgress = async (progressId, phases) => {
  try {
    const response = await api.patch(`/projectProgress/${progressId}`, {
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
  progressId,
  phaseId,
  newStatus,
  assignedTo = null
) => {
  try {
    // Primeiro buscar o progresso atual
    const currentProgress = await api.get(`/projectProgress/${progressId}`);
    const phases = currentProgress.data.phases;

    // Atualizar a fase específica
    const updatedPhases = phases.map((phase) => {
      if (phase.id === phaseId) {
        const updatedPhase = { ...phase, status: newStatus };

        // Gerenciar timestamps baseado no status
        if (newStatus === "in_progress" && !phase.startedAt) {
          updatedPhase.startedAt = new Date().toISOString();
        } else if (newStatus === "done" && !phase.completedAt) {
          updatedPhase.completedAt = new Date().toISOString();
        } else if (newStatus === "todo") {
          updatedPhase.startedAt = null;
          updatedPhase.completedAt = null;
        }

        if (assignedTo !== null) {
          updatedPhase.assignedTo = assignedTo;
        }

        return updatedPhase;
      }
      return phase;
    });

    // Atualizar no servidor
    const response = await api.patch(`/projectProgress/${progressId}`, {
      phases: updatedPhases,
      lastUpdated: new Date().toISOString(),
    });

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

    const phases = progress.phases;
    const todoPhases = phases.filter((p) => p.status === "todo").length;
    const inProgressPhases = phases.filter(
      (p) => p.status === "in_progress"
    ).length;
    const completedPhases = phases.filter((p) => p.status === "done").length;
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
